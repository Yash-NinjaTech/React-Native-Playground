import dayjs from 'dayjs'
import apiCore from '@/api/apiCore'
import * as apiTypes from '@/api/core'
import sleep from '@/utils/sleep'
import { TravelerInfo, BookingInfo, fillBookingQuestions } from './booking-questions'
import process from 'node:process'

const xApiKey = process.env.API_KEY || 'dev.adaf56a340b49d257157e68e2845bbd6'

const currency = 'USD'
const language = 'en'
const uom = 'mi'

const travelers: TravelerInfo[] = [
  {
    FULL_NAMES_FIRST: 'John',
    FULL_NAMES_LAST: 'Doe',
    AGEBAND: 'ADULT',
    EMAIL: 'ruslan@simplenight.com',
    PHONE: '463567890',
    COUNTRY: 'US',
  },
]

const booking: BookingInfo = {
  SPECIAL_REQUIREMENTS: 'Vegetarian meal',
  LANGUAGE_GUIDE: 'en',
}

async function main() {
  // ### 0. Location search
  const result = await apiCore.locations.locationsSearch({
    requestBody: {
      keyword: 'New York',
      type: 'locality,administrative_area_level_3',
    },
    language,
    xApiKey,
  })

  const location = result.results[0].latitude + ',' + result.results[0].longitude

  // ### 1. Search for products
  const products = await search(location)
  if (!products.length) {
    console.log('No products found')
    return
  }

  // ### 2. Get details and availability for the first product
  const productDetails = await apiCore.products.thingsDetails({
    productId: products[0].id,

    details: 'true',
    availability: 'true',

    availabilityDate: dayjs().add(41, 'days').format('YYYY-MM-DD'),
    availabilityAdults: '1',
    availabilityChildren: '0',

    language,
    currency,
    uom,

    xApiKey,
  })

  // Print the name of the first product
  console.log(`First product: ${productDetails.name} for ${productDetails.price} ${currency}`)

  // First variant of the first product
  const firstProductVariant = productDetails.variants[0]

  // ### 3. Create a cart
  let cart = await apiCore.carts.cartsCreate({
    requestBody: { currency },
    xApiKey,
  })
  console.log('Cart created:', cart.id)

  // ### 4. Add the first variant to the cart
  cart = await apiCore.carts.cartItemsCreate({
    cartId: cart.id,

    requestBody: {
      product_id: productDetails.id,
      qty: 1,

      booking_data: {
        category: 'things',
        variant_id: firstProductVariant.id,
        booking_questions: fillBookingQuestions(
          firstProductVariant.attributes.booking_questions || [],
          travelers,
          booking,
        ),
      },

      currency,
    },
    xApiKey,
  })
  console.log(`Product variant "${firstProductVariant.name}" added to cart:`, cart.id)

  // ### 5. Fill customer info on cart
  cart = await apiCore.carts.cartsUpdate({
    cartId: cart.id,
    requestBody: {
      customer: {
        first_name: travelers[0].FULL_NAMES_FIRST,
        last_name: travelers[0].FULL_NAMES_LAST,
        phone_prefix: '1',
        phone_number: travelers[0].PHONE,
        email: travelers[0].EMAIL,
        country: travelers[0].COUNTRY,
      },
      currency,
    },
    xApiKey,
  })
  console.log('Customer info filled:', cart.first_name, cart.last_name, cart.email)

  // ### 6. Create a booking
  const bookingResponse = await apiCore.bookings.bookingsCreate({
    requestBody: {
      cart_id: cart.id,
      payment: {
        card_name: 'John Doe',
        card_number: '4111111111111111',
        card_expiration: '2612', // YYMM
        card_sec: '999',
        address1: '123 Main St',
        city: 'New York',
        country: 'US',
        zipcode: '10001',
        state: 'NY',
      },
      captcha_token: 'empty',
      currency,
    },
    xApiKey,
  })

  // ### 7. 3DSecure if bookingResponse.redirect_url is present
  if (bookingResponse.redirect_url) {
    console.log('3DSecure redirect:', bookingResponse.redirect_url)
    return
  }

  // ### 8. Booking created
  console.log('Booking created:', bookingResponse.booking.id)

  // ### 9. Cancel the booking
  const cancelResponse = await apiCore.bookings.bookingsCancel({
    bookingId: bookingResponse.booking.id as string,
    requestBody: {
      reason: 'Customer request',
    },
    xApiKey,
  })
  console.log('Booking cancellation:', cancelResponse.success || cancelResponse.error)
}

async function search(location: string) {
  const searchResponse = await apiCore.products.thingsSearch({
    requestBody: {
      'start_location': location,
      'start_date': dayjs().add(40, 'day').format('YYYY-MM-DD'),
      'end_date': dayjs().add(42, 'day').format('YYYY-MM-DD'),
      'adults': 1,
      // Receive results in parts as soon as they are ready by making multiple requests.
      'poll': true,

      language,
      currency,
      uom,
    },
    xApiKey,
  })

  const results: apiTypes.ThingsSearchResponse['results'] = []

  while (true) {
    const response = await apiCore.products.thingsSearchPoll({
      requestBody: {},
      searchId: searchResponse.search.id,
      xApiKey,
    })

    // Your frontend now can show the results as they come in.
    console.log(`Found ${response.results.length} results`)
    results.push(...response.results)

    if (response.search.status === 'Complete') {
      console.log('Search is complete')
      break
    }

    await sleep(1000)
  }

  return results
}

main().catch(console.error)

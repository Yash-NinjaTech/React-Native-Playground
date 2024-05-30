import apiCore from './api/apiCore';

const xApiKey = 'dev.adaf56a340b49d257157e68e2845bbd6'; // dev
// Docs core: https://api.dev.v4.simplenight.com/api/docs/reference

/*
  1. It is super easy to implement.
  2. No efforts on maintaining the code.
  3. It's error-prone. Everything strictly typed.
  4. It is the same SDK Simplenight uses internally (whitelable, E2E tests, playwright, mobile).
  5. No more day-to-day questions about the API using: ah what attribute we need to send, it does not work.
 */

/*
  Migration:
  1. Update urls for search based on this: https://api.dev.v4.simplenight.com/api/docs/reference
  2. For the search endpoints:
    Move currency, language, and uom to the request body.
  3. Update urls fo details.
 */

async function main() {
  // await printConfig()

  // await printThingsToDo();

  // const hotelData = await searchHotels();
  // const hotelId = hotelData?.hotelId;
  // const roomId = hotelData?.roomId;

  // if (!hotelId || !roomId) {
  //   throw new Error("hotelId or roomId is null or undefined");
  // }

  // Things To Do Search
  // const thingsData = await thingsToDoSearch();
  // const thingsId = thingsData?.thingsId;
  // const variantId = thingsData?.variantId;

  // Hotel Search
  // const hotelData = await searchHotels();
  // const hotelId = hotelData?.hotelId;
  // const roomId = hotelData?.roomId;

  // Flight Search
  // const flightId = (await searchFlights()) ?? "";

  // Shows and Events Search
  const showData = await searchShows();
  const showId = showData?.showId;
  const ticketId = showData?.ticketId;
  const qty = showData?.qty;

  const cartId = await createCart();

  // Hotel Add To Cart
  // await addHotelToCart(cartId, hotelId, roomId);

  // Things To Do Add To Cart
  // await addThingsToDoToCart(cartId, thingsId, variantId);

  // Flight Add To Cart
  // await addFlightToCart(cartId, flightId);

  // Shows and Events Add To Cart
  //   await addShowToCart(cartId, showId, ticketId, qty);

  //   await cartCheckout(cartId);
  await thingsToDoSearch();
}

//
// Things To Do
//
async function thingsToDoSearch() {
  const searchResponse = await apiCore.products.thingsSearch({
    requestBody: {
      start_location: '40.7127753,-74.0059728',
      start_date: '2024-06-16',
      end_date: '2024-06-22',
      adults: 1,
      poll: false,
      language: 'en',
      currency: 'USD',
      uom: 'mi',
    },
    xApiKey,
  });

  console.log('things to do search:', searchResponse);

  const thingsId = searchResponse.results[0].id;

  const thingsDetails = await apiCore.products.thingsDetails({
    productId: thingsId,
    xApiKey,
    currency: 'USD',
    language: 'en',
    uom: 'mi',
    availability: 'true',
    availabilityAdults: '1',
    availabilityChildren: '0',
    availabilityDate: '2024-06-16',
  });

  console.log('Things Details:', thingsDetails);

  console.log('booking questions:', thingsDetails.attributes.booking_questions);

  const variantId = thingsDetails.variants[0].id;

  return {thingsId, variantId};
}

async function addThingsToDoToCart(
  cartId: string,
  thingsId: string,
  variantId: string,
) {
  const cartAddResponse = await apiCore.carts.cartItemsCreate({
    cartId,
    requestBody: {
      product_id: thingsId,
      currency: 'USD',
      qty: 1,
      booking_data: {
        category: 'things',
        variant_id: variantId,
        booking_questions: [
          {
            question: 'FULL_NAMES_FIRST',
            answer: 'John',
            travelerNum: 1,
          },
          {
            question: 'FULL_NAMES_LAST',
            answer: 'Doe',
            travelerNum: 1,
          },
          {
            question: 'AGEBAND',
            answer: 'ADULT',
            travelerNum: 1,
          },
          {
            question: 'LANGUAGE_GUIDE',
            answer: 'en',
          },
        ],
      },
    },
    xApiKey,
  });

  console.log('Cart Add Response:', cartAddResponse);

  return cartId;
}

//
// Hotels
//
async function searchHotels() {
  const hotelSearchResponse = await apiCore.products.hotelsSearch({
    requestBody: {
      start_location: '40.7127753,-74.0059728',
      start_date: '2024-08-16',
      end_date: '2024-08-22',
      adults: '2',
      poll: false,
      language: 'en',
      currency: 'USD',
      uom: 'mi',
    },
    xApiKey,
  });

  console.log('Hotel Search Results:', hotelSearchResponse);

  if (hotelSearchResponse.results.length > 0) {
    const hotelId = hotelSearchResponse.results[3].id;

    const hotelDetails = await apiCore.products.hotelsDetails({
      productId: hotelId,
      xApiKey,
      currency: 'USD',
      language: 'en',
      uom: 'mi',
    });

    const roomId = hotelDetails.rooms[3].id;

    console.log('Hotel Details:', hotelDetails);
    console.log('Hotel id:', hotelId);
    console.log('Room id:', roomId);

    return {hotelId, roomId};
  } else {
    console.log('No hotels found for the specified criteria.');
  }
}

async function addHotelToCart(cartId: string, hotelId: string, roomId: string) {
  const cartAddResponse = await apiCore.carts.cartItemsCreate({
    cartId,
    requestBody: {
      product_id: hotelId,
      currency: 'USD',
      qty: 1,
      booking_data: {
        category: 'hotels',
        room_id: roomId,
        booking_key: hotelId,
      },
    },
    xApiKey,
  });

  console.log('Cart Add Response:', cartAddResponse);

  return cartId;
}

//
// Flights
//
async function searchFlights() {
  const flightSearchResponse = await apiCore.products.flightsSearch({
    requestBody: {
      start_location: 'JFK',
      end_location: 'MCO',
      direction: 'RoundTrip',
      start_date: '2024-08-16',
      end_date: '2024-08-22',
      adults: 2,
      poll: false,
      language: 'en',
      currency: 'USD',
      uom: 'mi',
    },
    xApiKey,
  });

  console.log('Flight Search Results:', flightSearchResponse);

  if (flightSearchResponse.results.length > 0) {
    const flightId = flightSearchResponse.results[0].id;

    const flightDetails = await apiCore.products.flightsDetails({
      productId: flightId,
      xApiKey,
      currency: 'USD',
      language: 'en',
      uom: 'mi',
      availability: 'true',
      details: 'true',
      seatmaps: 'true',
    });

    console.log('Flight Details:', flightDetails);
    console.log('Flight id:', flightId);

    return flightId;
  } else {
    console.log('No flights found for the specified criteria.');
  }
}

async function addFlightToCart(cartId: string, flightId: string) {
  const cartAddResponse = await apiCore.carts.cartItemsCreate({
    cartId,
    requestBody: {
      product_id: flightId,
      currency: 'USD',
      qty: 1,
      booking_data: {
        category: 'flights',
        passengers: [
          {
            type: 'Adult',
            title: 'Mr',
            first_name: 'John',
            last_name: 'Doe',
            dob: '1980-01-01',
            gender: 'M',
            country: 'US',
            id: '1',
          },
          {
            type: 'Adult',
            title: 'Mrs',
            first_name: 'Jane',
            last_name: 'Doe',
            dob: '1980-01-01',
            gender: 'F',
            country: 'US',
            id: '2',
          },
        ],
        seats: [],
      },
    },
    xApiKey,
  });

  console.log('Cart Add Response:', cartAddResponse);

  return cartId;
}

//
// shows and events
//
async function searchShows() {
  const searchResponse = await apiCore.products.showsSearch({
    requestBody: {
      start_location: '40.7127753,-74.0059728',
      start_date: '2024-06-16',
      end_date: '2024-06-22',
      poll: false,
      language: 'en',
      currency: 'USD',
      uom: 'mi',
    },
    xApiKey,
  });

  console.log('shows and events search:', searchResponse);

  const showId = searchResponse.results[0].id;

  const showDetails = await apiCore.products.showsDetails({
    productId: showId,
    xApiKey,
    currency: 'USD',
    language: 'en',
    uom: 'mi',
  });

  console.log('Show Details:', showDetails);

  console.log('first ticket', showDetails.tickets[0]);
  console.log('first ticket delivery methods', showDetails.tickets[0].delivery);

  const ticketId = showDetails.tickets[0].id;

  const qty = showDetails.tickets[0].qty;

  return {showId, ticketId, qty};
}

async function addShowToCart(
  cartId: string,
  showId: string,
  ticketId: number,
  quantity: number,
) {
  const cartAddResponse = await apiCore.carts.cartItemsCreate({
    cartId,
    requestBody: {
      product_id: showId,
      currency: 'USD',
      qty: 1,
      booking_data: {
        category: 'shows-events',
        booking_questions: {
          delivery: 'FedEx Priority Overnight',
          address1: '4543 yadayada road',
          address2: '',
          city: 'New York',
          zipcode: '10001',
          state: 'NY',
          phone_prefix: '+1',
          phone_number: '1231231234',
        },
        ticket_id: ticketId,
        qty: quantity,
      },
    },
    xApiKey,
  });

  console.log('Cart Add Response:', cartAddResponse);

  return cartId;
}

// global funciton
async function createCart() {
  const cartResponse = await apiCore.carts.cartsCreate({
    requestBody: {
      currency: 'USD',
    },
    xApiKey,
  });

  console.log('cart create Response:', cartResponse);

  const cartId = cartResponse.id;

  const cartUpdateResponse = await apiCore.carts.cartsUpdate({
    cartId,
    requestBody: {
      currency: 'USD',
      customer: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'mailto:elxaitisaley@gmail.com',
        phone_number: '1231231234',
        phone_prefix: '1',
        country: 'us',
      },
    },
    xApiKey,
  });

  console.log('Cart Update Response:', cartUpdateResponse);

  return cartId;
}

// global funciton
async function cartCheckout(cartId: string) {
  const cartBookResponse = await apiCore.bookings.bookingsCreate({
    requestBody: {
      currency: 'USD',
      payment: {
        card_name: 'John Doe',
        card_number: '4111111111111111',
        card_expiration: '2612', // YYMM
        card_sec: '123',
        address1: '123 Main St',
        address2: 'Apt 4B',
        city: 'New York',
        country: 'US',
        zipcode: '10001',
        state: 'NY',
      },
      cart_id: cartId,
      captcha_token: 'empty',
    },
    xApiKey,
  });

  console.log('Cart Book Response:', cartBookResponse);
}
main().catch(console.error);

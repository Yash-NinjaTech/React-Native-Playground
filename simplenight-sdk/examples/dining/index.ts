import dayjs from 'dayjs';
import apiCore from '@/api/apiCore';
import * as apiTypes from '@/api/core';
import sleep from '@/utils/sleep';
// @ts-ignore
import {TravelerInfo, BookingInfo} from './booking-questions';
import * as process from 'node:process';

const xApiKey = process.env.API_KEY || 'dev.adaf56a340b49d257157e68e2845bbd6';

const currency = 'USD';
const language = 'en';
const uom = 'mi';

async function main() {
  // ### 0. Location search
  const result = await apiCore.locations.locationsSearch({
    requestBody: {
      keyword: 'New York',
      type: 'locality,administrative_area_level_3',
    },
    language,
    xApiKey,
  });

  const location =
    result.results[0].latitude + ',' + result.results[0].longitude;

  // ### 1. Search for products
  const products = await search(location);
  if (!products.length) {
    console.log('No products found');
    return;
  }

  // ### 2. Get details and availability for the first product
  const productDetails = await apiCore.products.diningDetails({
    productId: products[0].id,

    details: 'true',
    availability: 'true',

    availabilityDate: dayjs().add(41, 'days').format('YYYY-MM-DD'),
    availabilityAdults: 1,
    availabilityChildren: 0,

    language,
    currency,
    uom,

    xApiKey,
  });

  // Print the name of the first product
  console.log(
    `First product: ${productDetails.name} with average ${productDetails.price_description} price type`,
  );

  // ### 3. To book a restaurant you need to call
  // Most of restaurants do not have availability for booking
  console.log(
    `To book a restaurant you need to call: ${productDetails.attributes.phone}`,
  );
}

async function search(location: string) {
  const searchResponse = await apiCore.products.diningSearch({
    requestBody: {
      start_location: location,
      start_date: dayjs().add(40, 'day').format('YYYY-MM-DD'),
      adults: 1,
      // Receive results in parts as soon as they are ready by making multiple requests.
      poll: true,

      language,
      currency,
      uom,
    },
    xApiKey,
  });

  const results: apiTypes.DiningSearchResponse['results'] = [];

  while (true) {
    const response = await apiCore.products.diningSearchPoll({
      requestBody: {},
      searchId: searchResponse.search.id,
      xApiKey,
    });

    // Your frontend now can show the results as they come in.
    console.log(`Found ${response.results.length} results`);
    results.push(...response.results);

    if (response.search.status === 'Complete') {
      console.log('Search is complete');
      break;
    }

    await sleep(1000);
  }

  return results;
}

main().catch(console.error);

import apiCore from './api/apiCore';
import apiCommerce from './api/apiCommerce';
import type * as ApiTypes from './api/core';

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

  await printThingsToDo();
}

// make async sleep function
function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function printConfig() {
  const result = await apiCommerce.config.getConfigWeb({
    hostname: 'wl.dev.v4.simplenight.com',
  });

  //apiCommerce.request.config.HEADERS = {'x-api-key': process.env.NEXT_PUBLIC_API_KEY ?? ''} // temporary - load form configuration endpoint (based on hostname)
  //apiCommerce.request.config.TOKEN = 'XXX' // if user logged in

  console.log(result);
}

async function printThingsToDo() {
  const searchResponse = await apiCore.products.thingsSearch({
    requestBody: {
      start_location: '40.7127753,-74.0059728',
      start_date: '2024-05-16',
      end_date: '2024-05-22',
      adults: 1,
      poll: true,
      language: 'en',
      currency: 'USD',
      uom: 'mi',
    },
    xApiKey,
  });

  while (true) {
    const hotels = await apiCore.products.thingsSearchPoll({
      requestBody: {},
      searchId: searchResponse.search.id,
      xApiKey,
    });

    console.log(hotels);

    if (hotels.search.status === 'Complete') {
      break;
    }

    await sleep(1000);
  }
}

async function printHotels() {
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

    console.log('Hotel Details:', hotelDetails);
    console.log('Hotel id:', hotelId);
  } else {
    console.log('No hotels found for the specified criteria.');
  }
}

async function printShowsAndEvents() {
  const searchResponse = await apiCore.products.showsSearch({
    requestBody: {
      start_location: '40.7127753,-74.0059728',
      start_date: '2024-08-16',
      end_date: '2024-08-22',
      poll: false,
      language: 'en',
      currency: 'USD',
      uom: 'mi',
    },
    xApiKey,
  });

  console.log(searchResponse.results[0].id);

  const firstShowId = searchResponse.results[0].id;

  const showDetails = await apiCore.products.showsDetails({
    productId: firstShowId,
    xApiKey,
    currency: 'usd',
    language: 'en',
    uom: 'mi',
  });

  console.log(showDetails);
}

// async function printThingsToDo() {
//   const searchResponse = await apiCore.products.thingsSearch({
//     requestBody: {
//       start_location: '40.7127753,-74.0059728',
//       start_date: '2024-06-16',
//       end_date: '2024-06-22',
//       adults: 1,
//       poll: false,
//       language: 'en',
//       currency: 'USD',
//       uom: 'mi',
//     },
//     xApiKey,
//   });

//   console.log(searchResponse);

//   const firstThingId = searchResponse.results[0].id;

//   const thingDetails = await apiCore.products.thingsDetails({
//     productId: firstThingId,
//     xApiKey,
//     currency: 'usd',
//     language: 'en',
//     uom: 'mi',
//     availability: 'true',
//     availabilityAdults: '1',
//     availabilityChildren: '0',
//     availabilityDate: '2024-06-16',
//   });

//   console.log(thingDetails);
// }

main().catch(console.error);

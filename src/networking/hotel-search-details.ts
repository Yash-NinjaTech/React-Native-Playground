import apiCore from '@/api/apiCore';
import {xApiKey} from '@src/config';

export async function hotelSearchSDK(
  startDate: string,
  endDate: string,
  startLocation: string,
  adults: number,
) {
  try {
    const hotelSearchResponse = await apiCore.products.hotelsSearch({
      requestBody: {
        start_location: startLocation,
        start_date: startDate,
        end_date: endDate,
        adults: adults.toString(),
        poll: false,
        language: 'en',
        currency: 'USD',
        uom: 'mi',
      },
      xApiKey,
    });

    return hotelSearchResponse;
  } catch (error: any) {
    console.error('Error calling V4 sn sdk for hotel search:', error.message);
    console.error('Error V4 sn sdk for hotel search: ', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    throw error;
  }
}

export async function getHotelDetailsSDK(hotelIds: string[]) {
  console.log('xApiKey', xApiKey);

  try {
    const hotelDetailsPromises = hotelIds.map(hotelId =>
      apiCore.products
        .hotelsDetails({
          productId: hotelId,
          xApiKey,
          currency: 'USD',
          language: 'en',
          uom: 'mi',
        })
        .catch((error: any) => {
          console.error(
            `Error fetching details for hotel ID ${hotelId}:`,
            error.errors,
          );
          return null; // Return null if an individual call fails
        }),
    );
    const hotelDetails = await Promise.all(hotelDetailsPromises);
    return hotelDetails.filter(detail => detail !== null); // Filter out null results
  } catch (error: any) {
    console.error('Error calling v4 sn sdk for hotel details:', error.message);
    console.error('Error calling v4 sn sdk for hotel details:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    throw error;
  }
}

export async function hotelSearchAndDetailsSDK(
  startDate: string,
  endDate: string,
  location: string,
  adults: number,
) {
  console.log('first>>', startDate);
  console.log('first', endDate);

  console.log('first>>lo', location);

  console.log('first>>ad', adults);

  try {
    // Call the hotel search SDK
    const searchResults = await hotelSearchSDK(
      startDate,
      endDate,
      location,
      adults,
    );
    if (!searchResults || searchResults.results.length === 0) {
      console.log('No hotels found for the given search criteria.');
      return [];
    }

    // Extract hotel IDs from search results
    console.log('searchResults', searchResults);
    const hotelIds = searchResults.results.map(hotel => hotel.id);
    console.log('hotelIds', hotelIds);
    const first25HotelIds = hotelIds.slice(0, 2);

    // Fetch details for each hotel found
    const hotelDetails = await getHotelDetailsSDK(first25HotelIds);
    return hotelDetails;
  } catch (error) {
    console.error('Failed to search and fetch hotel details:', error);
    throw error;
  }
}

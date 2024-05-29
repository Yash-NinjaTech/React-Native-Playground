import apiCore from './api/apiCore';

// Simplenight API Configurations from Environment Variables
const xApiKey = process.env.NEW_V4_SIMPLENIGHT_API_KEY ?? '';

// Function to find activities from V4 API
export async function searchActivitiesV4(
  startDate: string,
  endDate: string,
  startLocation: string,
): Promise<any> {
  console.log('xapikey', xApiKey);

  try {
    const searchResponse = await apiCore.products.thingsSearch({
      requestBody: {
        start_location: startLocation,
        start_date: startDate,
        end_date: endDate,
        adults: 1,
        poll: false,
        language: 'en',
        currency: 'USD',
        uom: 'mi',
      },
      xApiKey,
    });

    // console.log('Activity details retrieved successfully:', searchResponse);
    return searchResponse;
  } catch (error: any) {
    console.error('Error calling V4 API for Activity search:', error.message);
    console.error('Error V4 API for Activity search: ', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    throw error;
  }
}

// Function to get details of activities from V4 API
export async function getActivityDetailsV4(
  activityIds: string[],
): Promise<any[]> {
  try {
    const activityDetailsPromises = activityIds.map(id =>
      apiCore.products.thingsDetails({
        productId: id,
        xApiKey,
        currency: 'USD',
        language: 'en',
        uom: 'mi',
        availability: 'false',
        availabilityAdults: '0',
        availabilityChildren: '0',
        availabilityDate: '',
      }),
    );
    const activityDetails = await Promise.all(activityDetailsPromises);

    // console.log('Activity details retrieved successfully:', activityDetails);
    return activityDetails;
  } catch (error: any) {
    console.error('Error retrieving activity details:', error.message);
    console.error('Detailed error: ', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    throw error;
  }
}

export async function searchActivitiesAndGetDetailsV4(
  startDate: string,
  endDate: string,
  startLocation: string,
): Promise<any[]> {
  try {
    // Perform the search for activities using the existing function
    const searchResponse = await searchActivitiesV4(
      startDate,
      endDate,
      startLocation,
    );

    // Extract activity IDs from the search results
    const activityIds = searchResponse.results.map(
      (activity: any) => activity.id,
    );

    const first25ActivityIds = activityIds.slice(0, 25);

    console.log('Activity IDs extracted from search results:', activityIds);

    // Retrieve details for each activity ID using the existing function
    const activityDetailsArray = await getActivityDetailsV4(first25ActivityIds);

    console.log(
      'Combined search and details retrieval successful - first Activity with details:',
      activityDetailsArray[0],
    );
    return activityDetailsArray;
  } catch (error: any) {
    console.error(
      'Error in combined search and details retrieval:',
      error.message,
    );
    throw error;
  }
}

// Function to get Activity Availability from V4 API
export async function getActivityAvailabilityV4(
  activityId: string,
  startDate: string,
  availabilityAdults: string,
  availabilityChildren: string,
): Promise<any> {
  try {
    const availabilityResponse = await apiCore.products.thingsDetails({
      productId: activityId,
      xApiKey,
      currency: 'USD',
      language: 'en',
      uom: 'mi',
      availability: 'true',
      availabilityAdults,
      availabilityChildren,
      availabilityDate: startDate,
    });

    console.log(
      'Activity Availability retrieved successfully:',
      availabilityResponse,
    );
    return availabilityResponse;
  } catch (error: any) {
    console.error('Error retrieving activity availability:', error.message);
    console.error('Detailed error: ', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    throw error;
  }
}

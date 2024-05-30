import apiCore from '@/api/apiCore';
import {xApiKey} from '@src/config';
import {SearchActivitiesState} from '@src/types/frontendInterfaces';

export async function searchActivitiesV4(
  activity: SearchActivitiesState,
): Promise<any> {
  console.log('xapikey', xApiKey);

  try {
    const searchResponse = await apiCore.products.thingsSearch({
      requestBody: {
        start_location: activity.startLocation,
        start_date: activity.startDate,
        end_date: activity.endDate,
        adults: 1,
        poll: false,
        language: 'en',
        currency: 'USD',
        uom: 'mi',
      },
      xApiKey,
    });
    console.log('searchResponse>>API', searchResponse);
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

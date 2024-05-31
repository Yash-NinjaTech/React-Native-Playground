import axios from 'axios';

let apiKey = process.env.SN_GOOGLE_MAPS_API_KEY;

export async function getCoordinatesForLocation(location: string) {
  const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
  const params = {
    address: location,
    key: apiKey!,
  };

  try {
    const response = await axios.get(baseUrl, {params});

    const url = `${baseUrl}?${new URLSearchParams(params).toString()}`;
    console.log('Final URL:', url);

    console.log('response', response);
    if (response.data && response.data.results && response.data.results[0]) {
      const lat = response.data.results[0].geometry.location.lat;
      const lng = response.data.results[0].geometry.location.lng;
      const res = lat.toString() + ', ' + lng.toString();
      console.log('Geocode result', res);
      return res;
    } else {
      throw new Error('No results found');
    }
  } catch (error: any) {
    throw new Error(`Failed to get coordinates: ${error.message}`);
  }
}

// this is only a temporary solution
// export async function getCoordinatesForLocationTemp(location: string) {
//   const baseUrl = 'https://nominatim.openstreetmap.org/search';
//   const params = {
//     q: location,
//     format: 'json',
//     limit: 1,
//     email: 'your-email@example.com', // Replace with your actual email
//   };

//   const config = {
//     params: params,
//     headers: {
//       'User-Agent': 'YourApp/1.0 (your-email@example.com)', // Replace with your application and contact info
//     },
//   };

//   try {
//     const response = await axios.get(baseUrl, config);
//     if (response.data && response.data[0]) {
//       const lat = parseFloat(response.data[0].lat);
//       const lng = parseFloat(response.data[0].lon);
//       const res = lat.toString() + ', ' + lng.toString();
//       console.log('geocode result', res);
//       return res;
//     } else {
//       throw new Error('No results found');
//     }
//   } catch (error: any) {
//     throw new Error(`Failed to get coordinates: ${error.message}`);
//   }
// }

// Usage example:
// getCoordinatesForLocation("Paris")
//   .then((coordinates) => console.log(coordinates))
//   .catch((error) => console.error(error.message));

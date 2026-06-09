import axios from 'axios';

const BASE_URL = 'https://forwarder.360logistics.kz';

const getNonce = () => window?.APP_DATA?.nonce || '07d1108ceb';

export async function fetchForwarderProfile() {
   const response = await axios.get(
      `${BASE_URL}/wp-json/forwarder/profile/v1/get`,
      {
         headers: {
            'X-WP-Nonce': getNonce(),
         },
         withCredentials: true,
      },
   );

   return response.data;
}

export async function updateForwarderProfile(payload) {
   const response = await axios.post(
      `${BASE_URL}/wp-json/forwarder/profile/v1/update`,
      payload,
      {
         headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': getNonce(),
         },
         withCredentials: true,
      },
   );

   return response.data;
}

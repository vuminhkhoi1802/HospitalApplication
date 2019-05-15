import { AsyncStorage } from 'react-native';

async function defaultHeader() {
  const headers = {
    'Accept-Language': 'vi-VN',
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const token = await AsyncStorage.getItem('com.beestromed.camellia.accessToken');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function mapResult(response) {
  if (response.status === 401 || response.status === 403) {
    global.Session.logout();
  }
  return response.text().then((text) => {
    try {
      const json = JSON.parse(text);
      if (json.status === 'success') {
        return json.data;
      }
      if (json.status === 'error') {
        return Promise.reject(new Error(json.message));
      }
      throw new Error(`Máy chủ đang gặp sự cố, vui lòng thử lại sau (${response.status})`);
    } catch (e) {
      throw new Error(`Máy chủ đang gặp sự cố, vui lòng thử lại sau (${response.status})`);
    }
  });
}

const ServiceHelper = { defaultHeader, mapResult };

export default ServiceHelper;

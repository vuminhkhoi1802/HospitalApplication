import { Constants } from 'expo';
import { AppConfig } from '@app/config';
import ServiceHelper from './ServiceHelper';

async function registerDevice(deviceToken) {
  return fetch(`${AppConfig.apiUrl}/communication-service/device/register`, {
    method: 'POST',
    headers: await ServiceHelper.defaultHeader(),
    body: JSON.stringify({
      deviceToken,
      deviceType: Constants.platform.ios ? 'IOS' : 'ANDROID',
      pushServer: 'EXPO',
    }),
  }).then(response => console.log(`[PUSH] Register Status: ${response.status}`))
    .catch(() => {});
  // ignore response, so we don't need ServiceHelper#mapResult here
}

async function unregisterDevice(deviceToken) {
  return fetch(`${AppConfig.apiUrl}/communication-service/device/unregister`, {
    method: 'POST',
    headers: await ServiceHelper.defaultHeader(),
    body: JSON.stringify({
      deviceToken,
      deviceType: Constants.platform.ios ? 'IOS' : 'ANDROID',
      pushServer: 'EXPO',
    }),
  }); // ignore response, so we don't need ServiceHelper#mapResult here
}

const PushService = { registerDevice, unregisterDevice };

export default PushService;

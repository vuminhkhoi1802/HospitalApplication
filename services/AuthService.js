import { AppConfig } from '@app/config';
import { AsyncStorage } from 'react-native';
import ServiceHelper from './ServiceHelper';

async function login(phone, password) {
  return fetch(`${AppConfig.apiUrl}/uaa/login`, {
    method: 'POST',
    headers: await ServiceHelper.defaultHeader(),
    body: JSON.stringify({
      phone,
      password,
      tenantId: 'tenant-vietuc',
      profileType: 'CONSUMER',
      grantType: 'password',
    }),
  }).then(response => ServiceHelper.mapResult(response));
}

async function register(phone, password, email, fullName) {
  return fetch(`${AppConfig.apiUrl}/master-tenant/register`, {
    method: 'POST',
    headers: await ServiceHelper.defaultHeader(),
    body: JSON.stringify({
      phone,
      password,
      email,
      fullName,
      tenantId: 'tenant-vietuc',
      profileType: 'CONSUMER',
      authenticationType: 'password',
    }),
  }).then(response => ServiceHelper.mapResult(response));
}

async function uploadAvatar(formData) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
  };
  const token = await AsyncStorage.getItem('com.beestromed.camellia.accessToken');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return fetch(`${AppConfig.apiUrl}/storage-service/profile/avatar`, {
    method: 'POST',
    headers: this.headers,
    body: formData,
  }).then(response => ServiceHelper.mapResult(response));
}

async function forgotPassword(phone) {
  return fetch(`${AppConfig.apiUrl}/profile-service/forgot`, {
    method: 'POST',
    headers: await ServiceHelper.defaultHeader(),
    body: JSON.stringify({
      phone,
    }),
  }).then(response => ServiceHelper.mapResult(response));
}

async function logout() {
  return fetch(`${AppConfig.apiUrl}/uaa/logout`, {
    method: 'POST',
  }).then(response => ServiceHelper.mapResult(response));
}

const UserService = {
  login,
  register,
  forgotPassword,
  logout,
  uploadAvatar,
};

export default UserService;

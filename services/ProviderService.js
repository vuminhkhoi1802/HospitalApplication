import { AppConfig } from '@app/config';
import ServiceHelper from './ServiceHelper';

async function getProvider(providerId, fetchType) {
  let url = `${AppConfig.apiUrl}/master-tenant/profile?profileId=${providerId}`;
  if (fetchType) {
    url = `${url}&fetchType=${fetchType}`;
  }
  return fetch(url, {
    method: 'GET',
    headers: await ServiceHelper.defaultHeader(),
  }).then(response => ServiceHelper.mapResult(response));
}

async function getSchedule(providerId, startDate, endDate) {
  const url = `${AppConfig.apiUrl}/master-tenant/provider/${providerId}/schedule?startDate=${startDate}&endDate=${endDate}&offset=0&limit=9999`;
  return fetch(url, {
    method: 'GET',
    headers: await ServiceHelper.defaultHeader(),
  }).then(response => ServiceHelper.mapResult(response));
}

async function getWorkingTime(providerId) {
  const url = `${AppConfig.apiUrl}/profile-service/provider/${providerId}/working-time`;
  return fetch(url, {
    method: 'GET',
    headers: await ServiceHelper.defaultHeader(),
  }).then(response => ServiceHelper.mapResult(response));
}

async function getPhoto(profileId) {
  const url = `${AppConfig.apiUrl}/profile-service/profile/photo?profileId=${profileId}`;
  return fetch(url, {
    method: 'GET',
    headers: await ServiceHelper.defaultHeader(),
  }).then(response => ServiceHelper.mapResult(response));
}

async function createTask(providerId, startDate, endDate, taskForm) {
  const body = JSON.stringify({
    note: taskForm.note,
    memberId: taskForm.member.profileId,
    startDate,
    endDate,
    providerId,
    extras: [{ key: 'pickup', value: `${taskForm.extra.pickup}` }],
  });
  const url = `${AppConfig.apiUrl}/master-tenant/consumer/${global.Session.user.profileId}/task`;
  return fetch(url, {
    method: 'POST',
    headers: await ServiceHelper.defaultHeader(),
    body,
  }).then(response => ServiceHelper.mapResult(response));
}

const ProviderService = {
  getProvider,
  getSchedule,
  getWorkingTime,
  getPhoto,
  createTask,
};

export default ProviderService;

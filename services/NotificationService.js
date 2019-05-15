import { AppConfig } from '@app/config';
import ServiceHelper from './ServiceHelper';

async function countNotification(read) {
  const queryParams = `read=${read}`;
  return fetch(`${AppConfig.apiUrl}/master-tenant/notification/count?${queryParams}`, {
    method: 'GET',
    headers: await ServiceHelper.defaultHeader(),
  }).then(response => ServiceHelper.mapResult(response));
}

async function listNotifications(offset, limit) {
  const queryParams = `offset=${offset}&limit=${limit}`;
  return fetch(`${AppConfig.apiUrl}/master-tenant/notification?${queryParams}`, {
    method: 'GET',
    headers: await ServiceHelper.defaultHeader(),
  }).then(response => ServiceHelper.mapResult(response));
}

async function readNotification(id) {
  return fetch(`${AppConfig.apiUrl}/master-tenant/notification/${id}/read`, {
    method: 'PUT',
    headers: await ServiceHelper.defaultHeader(),
  }).then(response => ServiceHelper.mapResult(response));
}
const NotificationService = {
  countNotification,
  listNotifications,
  readNotification,
};

export default NotificationService;

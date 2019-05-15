import { AppConfig } from '@app/config';
import ServiceHelper from './ServiceHelper';

async function getTaskDetail(taskId) {
  return fetch(`${AppConfig.apiUrl}/master-tenant/task/${taskId}`, {
    method: 'GET',
    headers: await ServiceHelper.defaultHeader(),
  }).then(response => ServiceHelper.mapResult(response));
}

async function getTasks(consumerId, offset, limit = 10, statuses) {
  const queryParams = `offset=${offset}&limit=${limit}&status=${statuses}`;
  const url = `${AppConfig.apiUrl}/master-tenant/consumer/${consumerId}/task?${queryParams}`;
  return fetch(url, {
    method: 'GET',
    headers: await ServiceHelper.defaultHeader(),
  }).then(response => ServiceHelper.mapResult(response));
}

async function cancelTask(taskId, reason) {
  return fetch(`${AppConfig.apiUrl}/master-tenant/task/${taskId}/cancel`, {
    method: 'POST',
    headers: await ServiceHelper.defaultHeader(),
    body: JSON.stringify({
      reason,
    }),
  }).then(response => ServiceHelper.mapResult(response));
}

async function acceptTask(taskId, profileId) {
  return fetch(`${AppConfig.apiUrl}/master-tenant/task/${taskId}/accept`, {
    method: 'POST',
    headers: await ServiceHelper.defaultHeader(),
    body: JSON.stringify({
      consumerId: profileId,
    }),
  }).then(response => ServiceHelper.mapResult(response));
}

const TaskService = {
  getTaskDetail,
  getTasks,
  cancelTask,
  acceptTask,
};

export default TaskService;

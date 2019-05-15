import { AppConfig } from '@app/config';
import ServiceHelper from './ServiceHelper';

async function getProfile() {
  return fetch(`${AppConfig.apiUrl}/master-tenant/profile`, {
    method: 'GET',
    headers: await ServiceHelper.defaultHeader(),
  }).then(response => ServiceHelper.mapResult(response));
}

async function getMembers() {
  return fetch(`${AppConfig.apiUrl}/profile-service/profile/search`, {
    method: 'POST',
    headers: await ServiceHelper.defaultHeader(),
    body: JSON.stringify({
      profileType: ['MEMBER'],
      userId: global.Session.user.userId,
    }),
  }).then(response => ServiceHelper.mapResult(response));
}

async function addMember(memberProfile) {
  return fetch(`${AppConfig.apiUrl}/profile-service/profile`, {
    method: 'POST',
    headers: await ServiceHelper.defaultHeader(),
    body: JSON.stringify({
      tenantId: 'tenant-vietuc',
      profileType: 'MEMBER',
      profileSubType: memberProfile.profileSubType,
      fullName: memberProfile.fullName,
      gender: memberProfile.gender,
      birthday: memberProfile.birthday,
      nickName: memberProfile.nickName,
      height: memberProfile.height,
      weight: memberProfile.weight,
    }),
  }).then(response => ServiceHelper.mapResult(response));
}

async function updateMember(memberProfile) {
  console.log('member: ', memberProfile);
  return fetch(`${AppConfig.apiUrl}/profile-service/profile`, {
    method: 'PUT',
    headers: await ServiceHelper.defaultHeader(),
    body: JSON.stringify({
      tenantId: 'tenant-vietuc',
      profileId: memberProfile.profileId,
      profileType: 'MEMBER',
      profileSubType: memberProfile.profileSubtype,
      fullName: memberProfile.fullName,
      gender: memberProfile.gender,
      birthday: memberProfile.birthday,
      nickName: memberProfile.nickName,
      height: memberProfile.height,
      weight: memberProfile.weight,
      bloodType: memberProfile.bloodType,
    }),
  }).then(response => ServiceHelper.mapResult(response));
}

async function updateProfile(current, newPassword) {
  return fetch(`${AppConfig.apiUrl}/profile-service/user`, {
    method: 'PUT',
    headers: await ServiceHelper.defaultHeader(),
    body: JSON.stringify({
      oldPassword: current,
      password: newPassword,
    }),
  }).then(response => ServiceHelper.mapResult(response));
}

async function getReference(key) {
  const queryParams = `key=${key}`;
  return fetch(`${AppConfig.apiUrl}/profile-service/reference?${queryParams}`, {
    method: 'GET',
    headers: await ServiceHelper.defaultHeader(),
  }).then(response => ServiceHelper.mapResult(response));
}

const UserService = {
  getProfile,
  getMembers,
  addMember,
  updateMember,
  updateProfile,
  getReference,
};

export default UserService;

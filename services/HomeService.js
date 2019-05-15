import { AppConfig } from '@app/config';
import ServiceHelper from './ServiceHelper';

async function getNews() {
  return fetch('http://nhakhoavietuc.com/wp-json/wp/v2/posts?page=1', {
  });
}

async function getBanners() {
  return fetch(`${AppConfig.apiUrl}/storage-service/banner`, {
    method: 'GET',
  }).then(response => ServiceHelper.mapResult(response));
}

const HomeService = {
  getNews,
  getBanners,
};

export default HomeService;

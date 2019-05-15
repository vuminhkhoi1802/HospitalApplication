import { AppConfig } from '@app/config';
import ServiceHelper from './ServiceHelper';

async function listPromotions(mOffset, mLimit, mStatus) {
  return fetch(`${AppConfig.apiUrl}/master-tenant/promotions`, {
    method: 'POST',
    headers: await ServiceHelper.defaultHeader(),
    body: JSON.stringify({
      offset: mOffset,
      limit: mLimit,
      status: mStatus,
    }),
  }).then(response => ServiceHelper.mapResult(response));
}
const PromotionService = {
  listPromotions,
};

export default PromotionService;

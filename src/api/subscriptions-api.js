import { apiService } from './api-service';

const getAll = async () => await apiService.get('/Subscription/GetAllSubscriptions');
const getById = async (id) => await apiService.get(`/Subscription/GetSubscriptionById/${id}`);
const create = async (model) => await apiService.post('/Subscription/CreateSubscription', model);
const update = async (model) => await apiService.post('/Subscription/UpdateSubscription', model);
const remove = async (id) => await apiService.delete(`/Subscription/DeleteSubscription/${id}`);

// const simulatePaymentApproved = async (subscriptionId) =>
//   await apiService.post(`/Subscription/SimulatePaymentApproved/${subscriptionId}`);

// const simulatePaymentRefused = async (subscriptionId) =>
//   await apiService.post(`/Subscription/SimulatePaymentRefused/${subscriptionId}`);

const getActiveByInstitution = async (institutionId) =>
  await apiService.get(`/Subscription/GetActiveSubscriptionByInstitution/${institutionId}`);

export const subscriptionsApi = {
  getAll,
  getById,
  create,
  update,
  remove,
//   simulatePaymentApproved,
//   simulatePaymentRefused,
  getActiveByInstitution
};

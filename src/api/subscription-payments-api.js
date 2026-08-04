import { apiService } from './api-service';

const getAll = async () => await apiService.get('/SubscriptionPayment/GetAllSubscriptionPayments');
const getById = async (id) => await apiService.get(`/SubscriptionPayment/GetSubscriptionPaymentById/${id}`);
const create = async (model) => await apiService.post('/SubscriptionPayment/CreateSubscriptionPayment', model);
const update = async (model) => await apiService.post('/SubscriptionPayment/UpdateSubscriptionPayment', model);
const remove = async (id) => await apiService.delete(`/SubscriptionPayment/DeleteSubscriptionPayment/${id}`);

export const subscriptionPaymentsApi = {
  getAll,
  getById,
  create,
  update,
  remove
};

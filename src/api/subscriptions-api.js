import { apiService } from './api-service';

/** Lista todas as assinaturas (GET /Subscription/GetAllSubscriptions). */
const getAll = async () => await apiService.get('/Subscription/GetAllSubscriptions');

/** Busca uma assinatura pelo id, passado na rota (GET /Subscription/GetSubscriptionById/{id}). */
const getById = async (id) => await apiService.get(`/Subscription/GetSubscriptionById/${id}`);

/** Cria uma nova assinatura (POST /Subscription/CreateSubscription). */
const create = async (model) => await apiService.post('/Subscription/CreateSubscription', model);

/** Chama a atualização da assinatura do id informado, sem enviar corpo (POST /Subscription/UpdateSubscription/{id}). */
const update = async (id) => await apiService.post(`/Subscription/UpdateSubscription/${id}`);

/** Exclui uma assinatura pelo id (DELETE /Subscription/DeleteSubscription/{id}). */
const remove = async (id) => await apiService.delete(`/Subscription/DeleteSubscription/${id}`);

// const simulatePaymentApproved = async (subscriptionId) =>
//   await apiService.post(`/Subscription/SimulatePaymentApproved/${subscriptionId}`);

// const simulatePaymentRefused = async (subscriptionId) =>
//   await apiService.post(`/Subscription/SimulatePaymentRefused/${subscriptionId}`);

/** Busca a assinatura ativa de uma instituição (GET /Subscription/GetActiveSubscriptionByInstitution/{institutionId}). */
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

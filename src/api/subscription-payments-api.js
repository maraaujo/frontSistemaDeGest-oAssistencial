import { apiService } from './api-service';

/** Lista todos os pagamentos de assinatura (GET /SubscriptionPayment/GetAllSubscriptionPayments). */
const getAll = async () => await apiService.get('/SubscriptionPayment/GetAllSubscriptionPayments');

/** Busca um pagamento de assinatura pelo id, passado na rota (GET /SubscriptionPayment/GetSubscriptionPaymentById/{id}). */
const getById = async (id) => await apiService.get(`/SubscriptionPayment/GetSubscriptionPaymentById/${id}`);

/** Registra um novo pagamento de assinatura (POST /SubscriptionPayment/CreateSubscriptionPayment). */
const create = async (model) => await apiService.post('/SubscriptionPayment/CreateSubscriptionPayment', model);

/** Chama a atualização do pagamento de assinatura do id informado, sem enviar corpo (POST /SubscriptionPayment/UpdateSubscriptionPayment/{id}). */
const update = async (id) => await apiService.post(`/SubscriptionPayment/UpdateSubscriptionPayment/${id}`);

/** Exclui um pagamento de assinatura pelo id (DELETE /SubscriptionPayment/DeleteSubscriptionPayment/{id}). */
const remove = async (id) => await apiService.delete(`/SubscriptionPayment/DeleteSubscriptionPayment/${id}`);

export const subscriptionPaymentsApi = {
  getAll,
  getById,
  create,
  update,
  remove
};

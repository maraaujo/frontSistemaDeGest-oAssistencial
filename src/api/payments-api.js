import { apiService } from './api-service';

/** Lista todos os pagamentos (GET /Payment/GetAllPayments). */
const getAll = async () => await apiService.get('/Payment/GetAllPayments');

/** Busca um pagamento pelo id, passado na rota (GET /Payment/GetPaymentById/{id}). */
const getById = async (id) => await apiService.get(`/Payment/GetPaymentById/${id}`);

/** Registra um novo pagamento (POST /Payment/CreatePayment). */
const create = async (model) => await apiService.post('/Payment/CreatePayment', model);

/** Chama a atualização do pagamento do id informado, sem enviar corpo (POST /Payment/UpdatePayment/{id}). */
const update = async (id) => await apiService.post(`/Payment/UpdatePayment/${id}`);

/** Exclui um pagamento pelo id (DELETE /Payment/DeletePayment/{id}). */
const remove = async (id) => await apiService.delete(`/Payment/DeletePayment/${id}`);

/** Busca pagamentos conforme o filtro (POST /Payment/FilterPayment). */
const filter = async (filter) => await apiService.post('/Payment/FilterPayment', filter);

export const paymentsApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter
};

import { apiService } from './api-service';

const getAll = async () => await apiService.get('/Payment/GetAllPayments');
const getById = async (id) => await apiService.get(`/Payment/GetPaymentById/${id}`);
const create = async (model) => await apiService.post('/Payment/CreatePayment', model);
const update = async (id) => await apiService.post(`/Payment/UpdatePayment/${id}`);
const remove = async (id) => await apiService.delete(`/Payment/DeletePayment/${id}`);
const filter = async (filter) => await apiService.post('/Payment/FilterPayment', filter);

export const paymentsApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter
};

import { apiService } from './api-service';

const getAll = async () => await apiService.get('/LoginAccount/GetAllLoginAccounts');
const getById = async (id) => await apiService.get(`/LoginAccount/GetLoginAccountById/${id}`);
const create = async (model) => await apiService.post('/LoginAccount/CreateLoginAccount', model);
const update = async (model) => await apiService.post('/LoginAccount/UpdateLoginAccount', model);
const remove = async (id) => await apiService.delete(`/LoginAccount/DeleteLoginAccount/${id}`);
const login = async (model) => await apiService.post('/LoginAccount/Login', model);
export const loginAccountsApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  login
};

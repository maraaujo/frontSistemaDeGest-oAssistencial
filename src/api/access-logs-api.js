import { apiService } from './api-service';

const getAll = async () => await apiService.get('/AccessLog/GetAllAccessLogs');
const getById = async (id) => await apiService.get(`/AccessLog/GetAccessLogById/${id}`);
const create = async (model) => await apiService.post('/AccessLog/CreateAccessLog', model);
const update = async (model) => await apiService.post('/AccessLog/UpdateAccessLog', model);
const remove = async (id) => await apiService.delete(`/AccessLog/DeleteAccessLog/${id}`);
const filter = async (filter) => await apiService.post('/AccessLog/GetAccessLogsByFilter', filter);

export const accessLogsApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter
};

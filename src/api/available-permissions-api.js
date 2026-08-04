import { apiService } from './api-service';

const getAll = async () => await apiService.get('/AvailablePermission/GetAllAvailablePermissions');
const getById = async (id) => await apiService.get(`/AvailablePermission/GetAvailablePermissionById/${id}`);
const create = async (model) => await apiService.post('/AvailablePermission/CreateAvailablePermission', model);
const update = async (model) => await apiService.post('/AvailablePermission/UpdateAvailablePermission', model);
const remove = async (id) => await apiService.delete(`/AvailablePermission/DeleteAvailablePermission/${id}`);

export const availablePermissionsApi = {
  getAll,
  getById,
  create,
  update,
  remove
};

import { apiService } from './api-service';

const getAll = async () => await apiService.get('/UserPermission/GetAllUserPermissions');
const getById = async (id) => await apiService.get(`/UserPermission/GetUserPermissionById/${id}`);
const create = async (model) => await apiService.post('/UserPermission/CreateUserPermission', model);
const update = async (id) => await apiService.post(`/UserPermission/UpdateUserPermission/${id}`);
const remove = async (id) => await apiService.delete(`/UserPermission/DeleteUserPermission/${id}`);

export const userPermissionsApi = {
  getAll,
  getById,
  create,
  update,
  remove
};

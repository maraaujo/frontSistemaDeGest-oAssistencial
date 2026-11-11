import { apiService } from './api-service';

/** Lista todas as permissões atribuídas a usuários (GET /UserPermission/GetAllUserPermissions). */
const getAll = async () => await apiService.get('/UserPermission/GetAllUserPermissions');

/** Busca uma permissão de usuário pelo id, passado na rota (GET /UserPermission/GetUserPermissionById/{id}). */
const getById = async (id) => await apiService.get(`/UserPermission/GetUserPermissionById/${id}`);

/** Atribui uma permissão a um usuário (POST /UserPermission/CreateUserPermission). */
const create = async (model) => await apiService.post('/UserPermission/CreateUserPermission', model);

/** Chama a atualização da permissão de usuário do id informado, sem enviar corpo (POST /UserPermission/UpdateUserPermission/{id}). */
const update = async (id) => await apiService.post(`/UserPermission/UpdateUserPermission/${id}`);

/** Remove uma permissão de usuário pelo id (DELETE /UserPermission/DeleteUserPermission/{id}). */
const remove = async (id) => await apiService.delete(`/UserPermission/DeleteUserPermission/${id}`);

export const userPermissionsApi = {
  getAll,
  getById,
  create,
  update,
  remove
};

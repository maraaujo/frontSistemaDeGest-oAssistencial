import { apiService } from './api-service';

/** Lista todas as permissões disponíveis no sistema (GET /AvailablePermission/GetAllAvailablePermissions). */
const getAll = async () => await apiService.get('/AvailablePermission/GetAllAvailablePermissions');

/** Busca uma permissão disponível pelo id, passado na rota (GET /AvailablePermission/GetAvailablePermissionById/{id}). */
const getById = async (id) => await apiService.get(`/AvailablePermission/GetAvailablePermissionById/${id}`);

/** Cria uma nova permissão disponível (POST /AvailablePermission/CreateAvailablePermission). */
const create = async (model) => await apiService.post('/AvailablePermission/CreateAvailablePermission', model);

/** Envia a alteração de uma permissão disponível, com o id dentro do model (POST /AvailablePermission/UpdateAvailablePermission). */
const update = async (model) => await apiService.post('/AvailablePermission/UpdateAvailablePermission', model);

/** Exclui uma permissão disponível pelo id (DELETE /AvailablePermission/DeleteAvailablePermission/{id}). */
const remove = async (id) => await apiService.delete(`/AvailablePermission/DeleteAvailablePermission/${id}`);

export const availablePermissionsApi = {
  getAll,
  getById,
  create,
  update,
  remove
};

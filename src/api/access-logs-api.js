import { apiService } from './api-service';

/** Lista todos os registros de log de acesso (GET /AccessLog/GetAllAccessLogs). */
const getAll = async () => await apiService.get('/AccessLog/GetAllAccessLogs');

/** Busca um log de acesso pelo id, passado na rota (GET /AccessLog/GetAccessLogById/{id}). */
const getById = async (id) => await apiService.get(`/AccessLog/GetAccessLogById/${id}`);

/** Cria um novo registro de log de acesso (POST /AccessLog/CreateAccessLog). */
const create = async (model) => await apiService.post('/AccessLog/CreateAccessLog', model);

/** Envia a alteração de um log de acesso, com o id dentro do model (POST /AccessLog/UpdateAccessLog). */
const update = async (model) => await apiService.post('/AccessLog/UpdateAccessLog', model);

/** Exclui um log de acesso pelo id (DELETE /AccessLog/DeleteAccessLog/{id}). */
const remove = async (id) => await apiService.delete(`/AccessLog/DeleteAccessLog/${id}`);

/** Busca os logs de acesso que atendem aos critérios do objeto de filtro (POST /AccessLog/GetAccessLogsByFilter). */
const filter = async (filter) => await apiService.post('/AccessLog/GetAccessLogsByFilter', filter);

export const accessLogsApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter
};

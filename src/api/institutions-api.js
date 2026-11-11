import { apiService } from './api-service';

/** Lista todas as instituições (GET /Institution/GetAllInstitutions). */
const getAll = async () => await apiService.get('/Institution/GetAllInstitutions');

/** Busca uma instituição pelo id (GET /Institution/GetInstitutionById/{id}). */
const getById = async (id) => await apiService.get(`/Institution/GetInstitutionById/${id}`);

/** Cadastra uma nova instituição (POST /Institution/CreateInstitution). */
const create = async (model) => await apiService.post('/Institution/CreateInstitution', model);

/** Envia a alteração de uma instituição, com o id dentro do model (POST /Institution/UpdateInstitution). */
const update = async (model) => await apiService.post('/Institution/UpdateInstitution', model);

/** Exclui uma instituição pelo id (DELETE /Institution/DeleteInstitution/{id}). */
const remove = async (id) => await apiService.delete(`/Institution/DeleteInstitution/${id}`);

export const institutionsApi = {
  getAll,
  getById,
  create,
  update,
  remove
};

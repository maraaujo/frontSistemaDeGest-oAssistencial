import { apiService } from './api-service';

/** Lista todas as doenças cadastradas (GET /Illness/GetAllIllnesses). */
const getAll = async () => await apiService.get('/Illness/GetAllIllnesses');

/** Busca uma doença pelo id (GET /Illness/GetIllnessById/{id}). */
const getById = async (id) => await apiService.get(`/Illness/GetIllnessById/${id}`);

/** Cadastra uma nova doença (POST /Illness/CreateIllness). */
const create = async (model) => await apiService.post('/Illness/CreateIllness', model);

/** Envia a alteração de uma doença, com o id dentro do model (POST /Illness/UpdateIllness). */
const update = async (model) => await apiService.post('/Illness/UpdateIllness', model);

/** Exclui uma doença pelo id (DELETE /Illness/DeleteIllness/{id}). */
const remove = async (id) => await apiService.delete(`/Illness/DeleteIllness/${id}`);

/** Busca doenças conforme os critérios do filtro (POST /Illness/FilterIllness). */
const filter = async (filter) => await apiService.post('/Illness/FilterIllness', filter);

export const illnessesApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter
};

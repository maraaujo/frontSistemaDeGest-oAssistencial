import { apiService } from './api-service';

/** Lista os tipos sanguíneos cadastrados (GET /v1/BloodType). */
const getAll = async () => await apiService.get('/v1/BloodType');

/** Busca um tipo sanguíneo pelo id (GET /v1/BloodType/{id}). */
const getById = async (id) => await apiService.get(`/v1/BloodType/${id}`);

/** Cria um novo tipo sanguíneo (POST /BloodType/CreateBloodType). */
const create = async (model) => await apiService.post('/BloodType/CreateBloodType', model);

/** Envia a alteração de um tipo sanguíneo, com o id dentro do model (POST /BloodType/UpdateBloodType). */
const update = async (model) => await apiService.post('/BloodType/UpdateBloodType', model);

/** Exclui um tipo sanguíneo pelo id (DELETE /BloodType/DeleteBloodType/{id}). */
const remove = async (id) => await apiService.delete(`/BloodType/DeleteBloodType/${id}`);

export const bloodTypesApi = {
  getAll,
  getById,
  create,
  update,
  remove
};

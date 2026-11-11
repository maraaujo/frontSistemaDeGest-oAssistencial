import { apiService } from './api-service';

/** Lista todas as condições clínicas (GET /ClinicalCondition/GetAllClinicalConditions). */
const getAll = async () => await apiService.get('/ClinicalCondition/GetAllClinicalConditions');

/** Busca uma condição clínica pelo id, enviado na query string (GET /ClinicalCondition/GetClinicalConditionById?id=...). */
const getById = async (id) => await apiService.get(`/ClinicalCondition/GetClinicalConditionById?id=${id}`);

/** Cria uma nova condição clínica (POST /ClinicalCondition/CreateClinicalCondition). */
const create = async (model) => await apiService.post('/ClinicalCondition/CreateClinicalCondition', model);

/** Atualiza a condição clínica do id informado com os dados do model (PUT /ClinicalCondition/Update/{id}). */
const update = async (id, model) => await apiService.put(`/ClinicalCondition/Update/${id}`, model);

/** Exclui uma condição clínica pelo id (DELETE /ClinicalCondition/DeleteClinicalCondition/{id}). */
const remove = async (id) => await apiService.delete(`/ClinicalCondition/DeleteClinicalCondition/${id}`);

/** Busca condições clínicas conforme os critérios do filtro (POST /ClinicalCondition/GetClinicalConditionByFilter). */
const filter = async (filter) => await apiService.post('/ClinicalCondition/GetClinicalConditionByFilter', filter);

export const clinicalConditionsApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter
};

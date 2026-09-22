import { apiService } from './api-service';

const getAll = async () => await apiService.get('/ClinicalCondition/GetAllClinicalConditions');
const getById = async (id) => await apiService.get(`/ClinicalCondition/GetClinicalConditionById?id=${id}`);
const create = async (model) => await apiService.post('/ClinicalCondition/CreateClinicalCondition', model);
const update = async (id, model) => await apiService.put(`/ClinicalCondition/Update/${id}`, model);
const remove = async (id) => await apiService.delete(`/ClinicalCondition/DeleteClinicalCondition/${id}`);
const filter = async (filter) => await apiService.post('/ClinicalCondition/GetClinicalConditionByFilter', filter);

export const clinicalConditionsApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter
};

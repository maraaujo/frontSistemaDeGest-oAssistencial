import { apiService } from './api-service';

const getAll = async () => await apiService.get('/MedicinePatientClinicalCondition/GetAll');
const getById = async (id) => await apiService.get(`/MedicinePatientClinicalCondition/GetById?id=${id}`);
const create = async (model) => await apiService.post('/MedicinePatientClinicalCondition/Create', model);
const update = async (id, model) => await apiService.put(`/MedicinePatientClinicalCondition/Update/${id}`, model);
const remove = async (id) => await apiService.get(`/MedicinePatientClinicalCondition/Delete/${id}`);
const filter = async (filter) => await apiService.post('/MedicinePatientClinicalCondition/GetMedicinePatientClinicalConditionByFilter', filter);

export const medicinePatientClinicalConditionsApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter
};

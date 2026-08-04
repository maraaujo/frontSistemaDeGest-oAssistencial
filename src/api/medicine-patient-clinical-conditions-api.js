import { apiService } from './api-service';

const getAll = async () => await apiService.get('/MedicinePatientClinicalCondition/GetAll');
const getById = async (id) => await apiService.get(`/MedicinePatientClinicalCondition/GetById/${id}`);
const create = async (model) => await apiService.post('/MedicinePatientClinicalCondition/Create', model);
const update = async (model) => await apiService.post('/MedicinePatientClinicalCondition/Update', model);
const remove = async (id) => await apiService.delete(`/MedicinePatientClinicalCondition/Delete/${id}`);
const filter = async (filter) => await apiService.post('/MedicinePatientClinicalCondition/Filter', filter);
const getMedicineReminders = async (filter) => await apiService.post('/MedicinePatientClinicalCondition/GetMedicineReminders', filter);

export const medicinePatientClinicalConditionsApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter,
  getMedicineReminders
};

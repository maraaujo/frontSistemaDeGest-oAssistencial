import { apiService } from './api-service';

const getAll = async () => await apiService.get('/PatientClinicalCondition/GetAllPatientClinicalConditions');
const getById = async (id) => await apiService.get(`/PatientClinicalCondition/GetPatientClinicalConditionById/${id}`);
const create = async (model) => await apiService.post('/PatientClinicalCondition/CreatePatientClinicalCondition', model);
const update = async (model) => await apiService.post('/PatientClinicalCondition/UpdatePatientClinicalCondition', model);
const remove = async (id) => await apiService.delete(`/PatientClinicalCondition/DeletePatientClinicalCondition/${id}`);
const filter = async (filter) => await apiService.post('/PatientClinicalCondition/FilterPatientClinicalCondition', filter);

export const patientClinicalConditionsApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter
};

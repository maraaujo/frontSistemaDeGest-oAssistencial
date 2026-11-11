import { apiService } from './api-service';

/** Lista todos os vínculos entre acolhidos e condições clínicas (GET /PatientClinicalCondition/GetAllPatientClinicalConditions). */
const getAll = async () => await apiService.get('/PatientClinicalCondition/GetAllPatientClinicalConditions');

/** Busca um vínculo acolhido x condição clínica pelo id, passado na rota (GET /PatientClinicalCondition/GetPatientClinicalConditionById/{id}). */
const getById = async (id) => await apiService.get(`/PatientClinicalCondition/GetPatientClinicalConditionById/${id}`);

/** Vincula uma condição clínica a um acolhido (POST /PatientClinicalCondition/CreatePatientClinicalCondition). */
const create = async (model) => await apiService.post('/PatientClinicalCondition/CreatePatientClinicalCondition', model);

/** Chama a atualização do vínculo do id informado, sem enviar corpo (POST /PatientClinicalCondition/UpdatePatientClinicalCondition/{id}). */
const update = async (id) => await apiService.post(`/PatientClinicalCondition/UpdatePatientClinicalCondition/${id}`);

/** Remove um vínculo acolhido x condição clínica pelo id (DELETE /PatientClinicalCondition/DeletePatientClinicalCondition/{id}). */
const remove = async (id) => await apiService.delete(`/PatientClinicalCondition/DeletePatientClinicalCondition/${id}`);

/** Busca vínculos acolhido x condição clínica conforme o filtro (POST /PatientClinicalCondition/FilterPatientClinicalCondition). */
const filter = async (filter) => await apiService.post('/PatientClinicalCondition/FilterPatientClinicalCondition', filter);

/** Lista as condições clínicas vinculadas a um acolhido (GET /PatientClinicalCondition/GetPatientClinicalConditionByPatientId/{patientId}). */
const getByPatientId = async (patientId) => await apiService.get(`/PatientClinicalCondition/GetPatientClinicalConditionByPatientId/${patientId}`);
export const patientClinicalConditionsApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter,
  getByPatientId  
};

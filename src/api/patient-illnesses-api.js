import { apiService } from './api-service';

/** Lista todos os vínculos entre acolhidos e doenças (GET /PatientIllness/GetAllPatientIllnesses). */
const getAll = async () => await apiService.get('/PatientIllness/GetAllPatientIllnesses');

/** Busca um vínculo acolhido x doença pelo id (GET /PatientIllness/GetPatientIllnessById/{id}). */
const getById = async (id) => await apiService.get(`/PatientIllness/GetPatientIllnessById/${id}`);

/** Vincula uma doença a um acolhido (POST /PatientIllness/CreatePatientIllness). */
const create = async (model) => await apiService.post('/PatientIllness/CreatePatientIllness', model);

/** Chama a atualização do vínculo do id informado, sem enviar corpo (POST /PatientIllness/UpdatePatientIllness/{id}). */
const update = async (id) => await apiService.post(`/PatientIllness/UpdatePatientIllness/${id}`);

/** Remove um vínculo acolhido x doença pelo id (DELETE /PatientIllness/DeletePatientIllness/{id}). */
const remove = async (id) => await apiService.delete(`/PatientIllness/DeletePatientIllness/${id}`);

/** Busca vínculos acolhido x doença conforme o filtro (POST /PatientIllness/FilterPatientIllness). */
const filter = async (filter) => await apiService.post('/PatientIllness/FilterPatientIllness', filter);

export const patientIllnessesApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter
};

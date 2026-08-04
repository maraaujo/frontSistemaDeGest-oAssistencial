import { apiService } from './api-service';

const getAll = async () => await apiService.get('/PatientIllness/GetAllPatientIllnesses');
const getById = async (id) => await apiService.get(`/PatientIllness/GetPatientIllnessById/${id}`);
const create = async (model) => await apiService.post('/PatientIllness/CreatePatientIllness', model);
const update = async (model) => await apiService.post('/PatientIllness/UpdatePatientIllness', model);
const remove = async (id) => await apiService.delete(`/PatientIllness/DeletePatientIllness/${id}`);
const filter = async (filter) => await apiService.post('/PatientIllness/FilterPatientIllness', filter);

export const patientIllnessesApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter
};

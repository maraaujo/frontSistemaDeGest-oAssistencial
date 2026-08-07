import { apiService } from './api-service';

const getAll = async () => await apiService.get('/Patient/GetAllPatients');
const getById = async (id) => await apiService.get(`/Patient/GetPatientById/${id}`);
const create = async (model) => await apiService.post('/Patient/CreatePatient', model);
const update = async (id) => await apiService.post(`/Patient/UpdatePatient/${id}`);
const remove = async (id) => await apiService.delete(`/Patient/DeletePatient/${id}`);
const filter = async (filter) => await apiService.post('/Patient/FilterPatient', filter);
const getMedicineReminders = async () => await apiService.get('/Patient/GetPatientsReminders');

export const patientsApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter,
  getMedicineReminders
};

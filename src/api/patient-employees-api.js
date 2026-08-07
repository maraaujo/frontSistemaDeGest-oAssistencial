import { apiService } from './api-service';

const getAll = async () => await apiService.get('/PatientEmployee/GetAllPatientEmployees');
const getById = async (id) => await apiService.get(`/PatientEmployee/GetPatientEmployeeById/${id}`);
const create = async (model) => await apiService.post('/PatientEmployee/CreatePatientEmployee', model);
const update = async (id) => await apiService.post(`/PatientEmployee/UpdatePatientEmployee/${id}`);
const remove = async (id) => await apiService.delete(`/PatientEmployee/DeletePatientEmployee/${id}`);
const filter = async (filter) => await apiService.post('/PatientEmployee/FilterPatientEmployee', filter);

export const patientEmployeesApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter
};

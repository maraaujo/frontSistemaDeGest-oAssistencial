import { apiService } from './api-service';

/** Lista todos os vínculos entre acolhidos e funcionários (GET /PatientEmployee/GetAllPatientEmployees). */
const getAll = async () => await apiService.get('/PatientEmployee/GetAllPatientEmployees');

/** Busca um vínculo acolhido x funcionário pelo id, passado na rota (GET /PatientEmployee/GetPatientEmployeeById/{id}). */
const getById = async (id) => await apiService.get(`/PatientEmployee/GetPatientEmployeeById/${id}`);

/** Vincula um funcionário a um acolhido (POST /PatientEmployee/CreatePatientEmployee). */
const create = async (model) => await apiService.post('/PatientEmployee/CreatePatientEmployee', model);

/** Chama a atualização do vínculo do id informado, sem enviar corpo (POST /PatientEmployee/UpdatePatientEmployee/{id}). */
const update = async (id) => await apiService.post(`/PatientEmployee/UpdatePatientEmployee/${id}`);

/** Remove um vínculo acolhido x funcionário pelo id (DELETE /PatientEmployee/DeletePatientEmployee/{id}). */
const remove = async (id) => await apiService.delete(`/PatientEmployee/DeletePatientEmployee/${id}`);

/** Busca vínculos acolhido x funcionário conforme o filtro (POST /PatientEmployee/FilterPatientEmployee). */
const filter = async (filter) => await apiService.post('/PatientEmployee/FilterPatientEmployee', filter);

export const patientEmployeesApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter
};

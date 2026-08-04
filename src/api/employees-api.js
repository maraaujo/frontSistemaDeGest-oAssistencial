import { apiService } from './api-service';

const getAll = async () => await apiService.get('/Employee/GetAllEmployees');
const getById = async (id) => await apiService.get(`/Employee/GetEmployeeById/${id}`);
const create = async (model) => await apiService.post('/Employee/CreateEmployee', model);
const update = async (model) => await apiService.post('/Employee/UpdateEmployee', model);
const remove = async (id) => await apiService.delete(`/Employee/DeleteEmployee/${id}`);
const filter = async (filter) => await apiService.post('/Employee/FilterEmployee', filter);

export const employeesApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter
};

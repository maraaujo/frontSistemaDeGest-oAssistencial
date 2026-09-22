import { apiService } from './api-service';

const getAll = async () => await apiService.get('/Department/GetAllDepartments');
const getById = async (id) => await apiService.get(`/Department/GetDepartmentById/${id}`);
const create = async (model) => await apiService.post('/Department/CreateDepartment', model);
const update = async (id, model) => await apiService.put(`/Department/Update/${id}`, model);
const remove = async (id) => await apiService.get(`/Department/DeleteDepartment/${id}`);
const filter = async (filter) => await apiService.post('/Department/FilterDepartment', filter);

export const departmentsApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter
};

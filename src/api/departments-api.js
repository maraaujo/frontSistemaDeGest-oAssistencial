import { apiService } from './api-service';

/** Lista todos os departamentos (GET /Department/GetAllDepartments). */
const getAll = async () => await apiService.get('/Department/GetAllDepartments');

/** Busca um departamento pelo id, passado na rota (GET /Department/GetDepartmentById/{id}). */
const getById = async (id) => await apiService.get(`/Department/GetDepartmentById/${id}`);

/** Cria um novo departamento (POST /Department/CreateDepartment). */
const create = async (model) => await apiService.post('/Department/CreateDepartment', model);

/** Atualiza o departamento do id informado com os dados do model (PUT /Department/Update/{id}). */
const update = async (id, model) => await apiService.put(`/Department/Update/${id}`, model);

/** Exclui um departamento pelo id (DELETE /Department/DeleteDepartment/{id}). */
const remove = async (id) => await apiService.delete(`/Department/DeleteDepartment/${id}`);

/** Busca departamentos conforme os critérios do filtro (POST /Department/FilterDepartment). */
const filter = async (filter) => await apiService.post('/Department/FilterDepartment', filter);

export const departmentsApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter
};

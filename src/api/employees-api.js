import { apiService } from './api-service';

/** Lista todos os funcionários (GET /Employee/GetAllEmployees). */
const getAll = async () => await apiService.get('/Employee/GetAllEmployees');

/** Busca um funcionário pelo id (GET /Employee/GetEmployeeById/{id}). */
const getById = async (id) => await apiService.get(`/Employee/GetEmployeeById/${id}`);

/** Cadastra um novo funcionário (POST /Employee/CreateEmployee). */
const create = async (model) => await apiService.post('/Employee/CreateEmployee', model);

/** Atualiza o funcionário do id informado com os dados do model (PUT /Employee/Update/{id}). */
const update = async (id, model) => await apiService.put(`/Employee/Update/${id}`,model);

/** Exclui um funcionário pelo id (DELETE /Employee/DeleteEmployee/{id}). */
const remove = async (id) => await apiService.delete(`/Employee/DeleteEmployee/${id}`);

/** Busca funcionários conforme os critérios do filtro (POST /Employee/GetEmployeeByFilter). */
const filter = async (filter) => await apiService.post('/Employee/GetEmployeeByFilter', filter);

export const employeesApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter
};

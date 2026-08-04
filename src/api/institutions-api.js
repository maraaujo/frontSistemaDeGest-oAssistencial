import { apiService } from './api-service';

const getAll = async () => await apiService.get('/Institution/GetAllInstitutions');
const getById = async (id) => await apiService.get(`/Institution/GetInstitutionById/${id}`);
const create = async (model) => await apiService.post('/Institution/CreateInstitution', model);
const update = async (model) => await apiService.post('/Institution/UpdateInstitution', model);
const remove = async (id) => await apiService.delete(`/Institution/DeleteInstitution/${id}`);

export const institutionsApi = {
  getAll,
  getById,
  create,
  update,
  remove
};

import { apiService } from './api-service';

const getAll = async () => await apiService.get('/Illness/GetAllIllnesses');
const getById = async (id) => await apiService.get(`/Illness/GetIllnessById/${id}`);
const create = async (model) => await apiService.post('/Illness/CreateIllness', model);
const update = async (model) => await apiService.post('/Illness/UpdateIllness', model);
const remove = async (id) => await apiService.delete(`/Illness/DeleteIllness/${id}`);
const filter = async (filter) => await apiService.post('/Illness/FilterIllness', filter);

export const illnessesApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter
};

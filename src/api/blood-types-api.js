import { apiService } from './api-service';

const getAll = async () => await apiService.get('/BloodType/GetAllBloodTypes');
const getById = async (id) => await apiService.get(`/BloodType/GetBloodTypeById/${id}`);
const create = async (model) => await apiService.post('/BloodType/CreateBloodType', model);
const update = async (model) => await apiService.post('/BloodType/UpdateBloodType', model);
const remove = async (id) => await apiService.delete(`/BloodType/DeleteBloodType/${id}`);

export const bloodTypesApi = {
  getAll,
  getById,
  create,
  update,
  remove
};

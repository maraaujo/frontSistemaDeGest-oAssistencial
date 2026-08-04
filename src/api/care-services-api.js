import { apiService } from './api-service';

const getAll = async () => await apiService.get('/CareService/GetAllCareServices');
const getById = async (id) => await apiService.get(`/CareService/GetCareServiceById/${id}`);
const create = async (model) => await apiService.post('/CareService/CreateCareService', model);
const update = async (model) => await apiService.post('/CareService/UpdateCareService', model);
const remove = async (id) => await apiService.delete(`/CareService/DeleteCareService/${id}`);
const filter = async (filter) => await apiService.post('/CareService/FilterCareService', filter);

export const careServicesApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter
};

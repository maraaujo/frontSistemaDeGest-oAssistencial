import { apiService } from './api-service';

const getAll = async () => await apiService.get('/Plan/GetAllPlans');
const getById = async (id) => await apiService.get(`/Plan/GetPlanById/${id}`);
const create = async (model) => await apiService.post('/Plan/CreatePlan', model);
const update = async (id) => await apiService.post(`/Plan/UpdatePlan/${id}`);
const remove = async (id) => await apiService.delete(`/Plan/DeletePlan/${id}`);

export const plansApi = {
  getAll,
  getById,
  create,
  update,
  remove
};

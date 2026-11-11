import { apiService } from './api-service';

/** Lista todos os planos de assinatura (GET /Plan/GetAllPlans). */
const getAll = async () => await apiService.get('/Plan/GetAllPlans');

/** Busca um plano pelo id, passado na rota (GET /Plan/GetPlanById/{id}). */
const getById = async (id) => await apiService.get(`/Plan/GetPlanById/${id}`);

/** Cadastra um novo plano (POST /Plan/CreatePlan). */
const create = async (model) => await apiService.post('/Plan/CreatePlan', model);

/** Chama a atualização do plano do id informado, sem enviar corpo (POST /Plan/UpdatePlan/{id}). */
const update = async (id) => await apiService.post(`/Plan/UpdatePlan/${id}`);

/** Exclui um plano pelo id (DELETE /Plan/DeletePlan/{id}). */
const remove = async (id) => await apiService.delete(`/Plan/DeletePlan/${id}`);

export const plansApi = {
  getAll,
  getById,
  create,
  update,
  remove
};

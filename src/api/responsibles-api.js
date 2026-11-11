import { apiService } from './api-service'

/** Lista todos os responsáveis cadastrados (GET /Responsible/GetAllResponsibles). */
const getAll = async () => await apiService.get('/Responsible/GetAllResponsibles')

/** Busca um responsável pelo id, passado na rota (GET /Responsible/GetResponsibleById/{id}). */
const getById = async id => await apiService.get(`/Responsible/GetResponsibleById/${id}`)

/** Cadastra um novo responsável (POST /Responsible/CreateResponsible). */
const create = async model => await apiService.post('/Responsible/CreateResponsible', model)

/** Atualiza o responsável do id informado com os dados do model (PUT /Responsible/Update/{id}). */
const update = async (id, model) => await apiService.put(`/Responsible/Update/${id}`, model)

/** Exclui um responsável pelo id (DELETE /Responsible/DeleteResponsible/{id}). */
const remove = async id => await apiService.delete(`/Responsible/DeleteResponsible/${id}`)

export const responsiblesApi = {
  getAll,
  getById,
  create,
  update,
  remove,
}

import { apiService } from './api-service'

const getAll = async () => await apiService.get('/Responsible/GetAllResponsibles')
const getById = async id => await apiService.get(`/Responsible/GetResponsibleById/${id}`)
const create = async model => await apiService.post('/Responsible/CreateResponsible', model)
const update = async (id, model) => await apiService.put(`/Responsible/Update/${id}`, model)
const remove = async id => await apiService.delete(`/Responsible/DeleteResponsible/${id}`)

export const responsiblesApi = {
  getAll,
  getById,
  create,
  update,
  remove,
}

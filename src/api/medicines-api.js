import { apiService } from './api-service'

const getAll = async () => await apiService.get('/Medicine/GetAllMedicines')
const getById = async id => await apiService.get(`/Medicine/GetMedicineById/${id}`)
const create = async model => await apiService.post('/Medicine/CreateMedicine', model)
const update = async (id, model) => await apiService.post(`/Medicine/UpdateMedicine/${id}`, model)
const remove = async id => await apiService.delete(`/Medicine/DeleteMedicine/${id}`)
const filter = async filter => await apiService.post('/Medicine/FilterMedicine', filter)

export const medicinesApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter,
}

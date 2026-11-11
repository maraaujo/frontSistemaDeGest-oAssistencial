import { apiService } from './api-service'

/** Lista todos os medicamentos cadastrados (GET /Medicine/GetAllMedicines). */
const getAll = async () => await apiService.get('/Medicine/GetAllMedicines')

/** Busca um medicamento pelo id, enviado na query string (GET /Medicine/GetMedicineById?id=...). */
const getById = async id => await apiService.get(`/Medicine/GetMedicineById?id=${id}`)

/** Cadastra um novo medicamento (POST /Medicine/CreateMedicine). */
const create = async model => await apiService.post('/Medicine/CreateMedicine', model)

/** Atualiza o medicamento do id informado com os dados do model (PUT /Medicine/Update/{id}). */
const update = async (id, model) => await apiService.put(`/Medicine/Update/${id}`, model)

/** Exclui um medicamento pelo id (DELETE /Medicine/DeleteMedicine/{id}). */
const remove = async id => await apiService.delete(`/Medicine/DeleteMedicine/${id}`)

/** Busca medicamentos conforme os critérios do filtro (POST /Medicine/GetMedicineByFilter). */
const filter = async filter => await apiService.post('/Medicine/GetMedicineByFilter', filter)

export const medicinesApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter,
}

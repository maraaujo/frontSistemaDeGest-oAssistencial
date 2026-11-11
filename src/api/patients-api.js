import { apiService } from './api-service'

/** Lista os acolhidos da instituição (GET /Patient/GetAllPatients). */
const getAll = async () => await apiService.get('/Patient/GetAllPatients')

/** Busca um acolhido pelo id, enviado na query string (GET /Patient/GetPatientById?id=...). */
const getById = async id => await apiService.get(`/Patient/GetPatientById?id=${id}`)

/** Cadastra um novo acolhido (POST /Patient/CreatePatient). */
const create = async model => await apiService.post('/Patient/CreatePatient', model)

/** Atualiza o acolhido do id informado com os dados do model (PUT /Patient/Update/{id}). */
const update = async (id, model) => await apiService.put(`/Patient/Update/${id}`, model)

/** Exclui um acolhido pelo id (DELETE /Patient/DeletePatient/{id}). */
const remove = async id => await apiService.delete(`/Patient/DeletePatient/${id}`)

/** Busca acolhidos conforme os critérios do filtro (POST /Patient/GetPatientFilter). */
const filter = async filter => await apiService.post('/Patient/GetPatientFilter', filter)

/** Busca os dados completos de um acolhido para a tela de detalhes (GET /Patient/GetPatientDetails/{id}). */
const getPatientDetails = async id => await apiService.get(`/Patient/GetPatientDetails/${id}`)
export const patientsApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter,
  getPatientDetails,
}

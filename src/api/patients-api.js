import { apiService } from './api-service'

const getAll = async () => await apiService.get('/Patient/GetAllPatients')
const getById = async id => await apiService.get(`/Patient/GetPatientById/${id}`)
const create = async model => await apiService.post('/Patient/CreatePatient', model)
const update = async (id, model) => await apiService.put(`/Patient/Update/${id}`, model)
const remove = async id => await apiService.delete(`/Patient/DeletePatient/${id}`)
const filter = async filter => await apiService.post('/Patient/GetPatientFilter', filter)
const getMedicineReminders = async () => await apiService.get('/Patient/GetPatientsReminders')
const getPatientDetails = async id => await apiService.get(`/Patient/GetPatientDetails/${id}`)
export const patientsApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter,
  getMedicineReminders,
  getPatientDetails,
}

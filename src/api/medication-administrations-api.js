import { apiService } from './api-service';

const getAll = async () => await apiService.get('/MedicationAdministration/GetAllMedicationAdministrations');
const getById = async (id) => await apiService.get(`/MedicationAdministration/GetMedicationAdministrationById/${id}`);
const create = async (model) => await apiService.post('/MedicationAdministration/CreateMedicationAdministration', model);
const update = async (id) => await apiService.post(`/MedicationAdministration/UpdateMedicationAdministration/${id}`);
const remove = async (id) => await apiService.delete(`/MedicationAdministration/DeleteMedicationAdministration/${id}`);
const filter = async (filter) => await apiService.post('/MedicationAdministration/GetPagedMedicationAdministrationByFilter', filter);

export const medicationAdministrationsApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter
};

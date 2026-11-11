import { apiService } from './api-service';

/** Lista todos os medicamentos programados (vínculo medicamento x acolhido/condição clínica) (GET /MedicinePatientClinicalCondition/GetAll). */
const getAll = async () => await apiService.get('/MedicinePatientClinicalCondition/GetAll');

/** Busca um medicamento programado pelo id, enviado na query string (GET /MedicinePatientClinicalCondition/GetById?id=...). */
const getById = async (id) => await apiService.get(`/MedicinePatientClinicalCondition/GetById?id=${id}`);

/** Cadastra um novo medicamento programado para um acolhido (POST /MedicinePatientClinicalCondition/Create). */
const create = async (model) => await apiService.post('/MedicinePatientClinicalCondition/Create', model);

/** Atualiza o medicamento programado do id informado com os dados do model (PUT /MedicinePatientClinicalCondition/Update/{id}). */
const update = async (id, model) => await apiService.put(`/MedicinePatientClinicalCondition/Update/${id}`, model);

/** Exclui um medicamento programado pelo id (DELETE /MedicinePatientClinicalCondition/Delete/{id}). */
const remove = async (id) => await apiService.delete(`/MedicinePatientClinicalCondition/Delete/${id}`);

/** Busca medicamentos programados conforme os critérios do filtro (POST /MedicinePatientClinicalCondition/GetMedicinePatientClinicalConditionByFilter). */
const filter = async (filter) => await apiService.post('/MedicinePatientClinicalCondition/GetMedicinePatientClinicalConditionByFilter', filter);

export const medicinePatientClinicalConditionsApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter
};

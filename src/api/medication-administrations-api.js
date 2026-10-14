import { apiService } from './api-service';

/**
 * Item do relatório diário de medicamentos (GetDailyMedicationReport).
 * @typedef {Object} DailyMedicationReportItem
 * @property {number} medicinePatientClinicalConditionId
 * @property {number} patientId
 * @property {string} patientName
 * @property {string} medicineName
 * @property {string} dosage
 * @property {string} frequency
 * @property {string} responsibleEmployeeName
 * @property {string} administrationTime - Horário planejado (HH:mm:ss)
 * @property {string} scheduledDateTime - ISO 8601 com offset (ex.: 2026-10-14T17:17:00-03:00)
 * @property {string|null} administeredDateTime - ISO 8601 com offset, null se ainda não administrado
 * @property {'Administrado'|'Atrasado'|'Pendente'} status
 * @property {string} observations
 */

const getAll = async () => await apiService.get('/MedicationAdministration/GetAllMedicationAdministrations');
const getById = async (id) => await apiService.get(`/MedicationAdministration/GetMedicationAdministrationById/${id}`);
const create = async (model) => await apiService.post('/MedicationAdministration/CreateMedicationAdministration', model);
const update = async (id, model) => await apiService.post(`/MedicationAdministration/UpdateMedicationAdministration/${id}`, model);
const remove = async (id) => await apiService.delete(`/MedicationAdministration/DeleteMedicationAdministration/${id}`);
const filter = async (filter) => await apiService.post('/MedicationAdministration/GetPagedMedicationAdministrationByFilter', filter);
const getMedicineReminders = async () => await apiService.get('/MedicationAdministration/GetMedicineReminders')

/**
 * @param {{ date?: string, patientId?: number|null }} [params] - date no formato YYYY-MM-DD; ambos opcionais
 */
const getDailyMedicationReport = async ({ date, patientId } = {}) => {
  const query = new URLSearchParams();
  if (date) query.append('date', date);
  if (patientId) query.append('patientId', patientId);
  const qs = query.toString();

  return await apiService.get(`/MedicationAdministration/GetDailyMedicationReport${qs ? `?${qs}` : ''}`);
}

export const medicationAdministrationsApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter,
  getMedicineReminders,
  getDailyMedicationReport
};

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

/** Lista todas as administrações de medicamento registradas (GET /MedicationAdministration/GetAllMedicationAdministrations). */
const getAll = async () => await apiService.get('/MedicationAdministration/GetAllMedicationAdministrations');

/** Busca uma administração de medicamento pelo id, passado na rota (GET /MedicationAdministration/GetMedicationAdministrationById/{id}). */
const getById = async (id) => await apiService.get(`/MedicationAdministration/GetMedicationAdministrationById/${id}`);

/** Registra que um medicamento foi administrado a um acolhido (POST /MedicationAdministration/CreateMedicationAdministration). */
const create = async (model) => await apiService.post('/MedicationAdministration/CreateMedicationAdministration', model);

/** Envia a alteração da administração do id informado (POST /MedicationAdministration/UpdateMedicationAdministration/{id}). */
const update = async (id, model) => await apiService.post(`/MedicationAdministration/UpdateMedicationAdministration/${id}`, model);

/** Exclui o registro de administração de medicamento pelo id (DELETE /MedicationAdministration/DeleteMedicationAdministration/{id}). */
const remove = async (id) => await apiService.delete(`/MedicationAdministration/DeleteMedicationAdministration/${id}`);

/** Busca o histórico de administrações de forma paginada, conforme o filtro (POST /MedicationAdministration/GetPagedMedicationAdministrationByFilter). */
const filter = async (filter) => await apiService.post('/MedicationAdministration/GetPagedMedicationAdministrationByFilter', filter);

/** Busca os lembretes das próximas doses de medicamento dos acolhidos (GET /MedicationAdministration/GetMedicineReminders). */
const getMedicineReminders = async () => await apiService.get('/MedicationAdministration/GetMedicineReminders')

/**
 * Busca o relatório diário de medicamentos (planejado x administrado) de um dia, opcionalmente
 * de um único acolhido (GET /MedicationAdministration/GetDailyMedicationReport?date=...&patientId=...).
 * Só inclui na query string os parâmetros preenchidos.
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

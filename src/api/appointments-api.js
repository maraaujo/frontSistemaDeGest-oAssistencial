import { apiService } from './api-service';

/** Lista todos os agendamentos (GET /Appointment/GetAllAppointments). */
const getAll = async () => await apiService.get('/Appointment/GetAllAppointments');

/** Busca um agendamento pelo id (GET /Appointment/GetAppointmentById/{id}). */
const getById = async (id) => await apiService.get(`/Appointment/GetAppointmentById/${id}`);

/** Cria um novo agendamento (POST /Appointment/CreateAppointment). */
const create = async (model) => await apiService.post('/Appointment/CreateAppointment', model);

/** Atualiza o agendamento do id informado com os dados do model (PUT /Appointment/Update/{id}). */
const update = async (id, model) => await apiService.put(`/Appointment/Update/${id}`, model);

/** Exclui um agendamento pelo id (DELETE /Appointment/DeleteAppointment/{id}). */
const remove = async (id) => await apiService.delete(`/Appointment/DeleteAppointment/${id}`);

/** Busca agendamentos de forma paginada, conforme os critérios do filtro (POST /Appointment/GetPagedAppointmentByFilter). */
const filter = async (filter) => await apiService.post('/Appointment/GetPagedAppointmentByFilter', filter);

export const appointmentsApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter
};

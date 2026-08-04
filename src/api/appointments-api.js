import { apiService } from './api-service';

const getAll = async () => await apiService.get('/Appointment/GetAllAppointments');
const getById = async (id) => await apiService.get(`/Appointment/GetAppointmentById/${id}`);
const create = async (model) => await apiService.post('/Appointment/CreateAppointment', model);
const update = async (model) => await apiService.post('/Appointment/UpdateAppointment', model);
const remove = async (id) => await apiService.delete(`/Appointment/DeleteAppointment/${id}`);
const filter = async (filter) => await apiService.post('/Appointment/FilterAppointment', filter);

export const appointmentsApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  filter
};

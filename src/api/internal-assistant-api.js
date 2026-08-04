import { apiService } from './api-service';

const ask = async (model) => await apiService.post('/InternalAssistant/Ask', model);

export const internalAssistantApi = {
  ask
};

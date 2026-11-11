import { apiService } from './api-service';

/** Envia uma pergunta ao assistente interno e recebe a resposta gerada pelo backend (POST /InternalAssistant/Ask). */
const ask = async (model) => await apiService.post('/InternalAssistant/Ask', model);

export const internalAssistantApi = {
  ask
};

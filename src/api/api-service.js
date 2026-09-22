import router from '@/router';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import { config } from './urls';

const apiHost = config.apiHost;

axios.interceptors.request.use(
  async (config) => {
    if (config.url?.includes('viacep')) return config;

 const storedData = sessionStorage.getItem("tltkn");

if (storedData) {
  try {
    const user = JSON.parse(storedData);

    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch (error) {
    console.error("Erro ao ler token:", error);
  }
}

    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && router.currentRoute.value.name !== 'login') {
      sessionStorage.removeItem('tltkn');

      // Avisa o usuário do motivo (sessão expirada) em vez de simplesmente
      // devolvê-lo à tela de login sem explicação, e preserva a rota atual
      // para retornar a ela após novo login.
      toast.info('Sua sessão expirou. Faça login novamente para continuar.');

      const current = router.currentRoute.value.fullPath;
      router.push({
        name: 'login',
        query: current && current !== '/' ? { redirect: current } : {},
      });
    }

    return Promise.reject(error);
  }
);

const getFullUrl = async (url) => {
    return await axios.get(`${url}`);
};
const get = async (url) => {
    return await axios.get(`${apiHost}${url}`);
};
const getHostedService = async (url) => {
    return await axios.get(`${hostserviceApi}${url}`);
};
const put = async (url, json) => {
    return await axios.put(`${apiHost}${url}`, json);
};
const deletar = async (url) => {
    return await axios.delete(`${apiHost}${url}`);
};
const post = async (url, json, isWebhookApi = false) => {
    let baseUrl = apiHost;
    if (isWebhookApi)
        baseUrl = apiWebhook;

    return await axios.post(`${baseUrl}${url}`, json);
};
const getFile = async (url) => {
    const options = {
        responseType: 'blob',
    };

    return await axios.get(`${apiHost}${url}`, options);
};
const postFile = async (url, data) => {
    const options = {
        responseType: 'blob',
    };

    return await axios.post(`${apiHost}${url}`, data, options);
};

export const apiService = {
    get,
    getFullUrl,
    put,
    post,
    getFile,
     delete: deletar,
    postFile,
    getHostedService
};

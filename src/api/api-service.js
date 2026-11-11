import router from '@/router';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import { config } from './urls';

const apiHost = config.apiHost;

// Interceptor de requisição: antes de cada chamada feita com o axios global, lê a sessão
// salva no sessionStorage (chave "tltkn", gravada pelo auth.js) e, se houver token,
// adiciona o cabeçalho "Authorization: Bearer <token>". Chamadas ao ViaCEP passam sem token.
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

// Interceptor de resposta: se o backend responder 401 (token ausente, inválido ou expirado)
// fora da tela de login, apaga a sessão, mostra um aviso e leva o usuário ao login,
// guardando a rota atual em "redirect". O erro continua sendo repassado a quem chamou.
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

/**
 * Faz um GET na URL completa informada, sem prefixar o endereço da API
 * (útil para serviços externos, como o ViaCEP).
 */
const getFullUrl = async (url) => {
    return await axios.get(`${url}`);
};

/**
 * Faz um GET no backend: concatena o endereço base da API (urls.js) com o caminho informado.
 * @param {string} url - caminho do endpoint, ex.: '/Patient/GetAllPatients'
 */
const get = async (url) => {
    return await axios.get(`${apiHost}${url}`);
};

/**
 * Faz um GET usando a base "hostserviceApi".
 * Atenção: essa variável não está declarada neste arquivo, então a chamada falharia.
 */
const getHostedService = async (url) => {
    return await axios.get(`${hostserviceApi}${url}`);
};

/** Faz um PUT no backend (endereço base da API + caminho), enviando json no corpo. */
const put = async (url, json) => {
    return await axios.put(`${apiHost}${url}`, json);
};

/** Faz um DELETE no backend (endereço base da API + caminho). Exposto como apiService.delete. */
const deletar = async (url) => {
    return await axios.delete(`${apiHost}${url}`);
};

/**
 * Faz um POST no backend (endereço base da API + caminho), enviando json no corpo.
 * @param {boolean} [isWebhookApi=false] - se true, usa a base "apiWebhook", que não está declarada neste arquivo
 */
const post = async (url, json, isWebhookApi = false) => {
    let baseUrl = apiHost;
    if (isWebhookApi)
        baseUrl = apiWebhook;

    return await axios.post(`${baseUrl}${url}`, json);
};

/** Faz um GET no backend pedindo a resposta como arquivo binário (Blob), ex.: para downloads. */
const getFile = async (url) => {
    const options = {
        responseType: 'blob',
    };

    return await axios.get(`${apiHost}${url}`, options);
};

/** Faz um POST no backend enviando data no corpo e recebendo a resposta como arquivo binário (Blob). */
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

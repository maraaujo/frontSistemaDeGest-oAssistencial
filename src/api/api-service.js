import router from '@/router';
import axios from 'axios';
import { config } from './urls';

const apiHost = config.apiHost;

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            router.push({ path: "/" });
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

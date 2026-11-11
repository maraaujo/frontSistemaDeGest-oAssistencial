import axios from 'axios'

// Instância separada do axios (importada como '@axios'), herdada do template e usada só
// por telas/stores de exemplo dele. Ela NÃO passa pelos interceptors de api/api-service.js
// (que ficam no axios global), então não envia o token JWT nem trata o 401; as chamadas
// ao backend do sistema usam o apiService.
const axiosIns = axios.create({
// You can add your headers here
// ================================
// baseURL: 'https://some-domain.com/api/',
// timeout: 1000,
// headers: {'X-Custom-Header': 'foobar'}
})

export default axiosIns

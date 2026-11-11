import { apiService } from './api-service'

/** Lista todas as contas de acesso (GET /LoginAccount/GetAllLoginAccounts). */
const getAll = async () => await apiService.get('/LoginAccount/GetAllLoginAccounts')

/** Busca uma conta de acesso pelo id (GET /LoginAccount/GetLoginAccountById/{id}). */
const getById = async id => await apiService.get(`/LoginAccount/GetLoginAccountById/${id}`)

/** Cria uma nova conta de acesso (POST /LoginAccount/CreateLoginAccount). */
const create = async model => await apiService.post('/LoginAccount/CreateLoginAccount', model)

/** Atualiza a conta de acesso do id informado com os dados do model (PUT /LoginAccount/Update/{id}). */
const update = async (id, model) => await apiService.put(`/LoginAccount/Update/${id}`, model)

/** Exclui uma conta de acesso pelo id (DELETE /LoginAccount/DeleteLoginAccount/{id}). */
const remove = async id => await apiService.delete(`/LoginAccount/DeleteLoginAccount/${id}`)

/** Autentica com e-mail e senha; a resposta traz o token JWT e os dados do usuário (POST /LoginAccount/Login). */
const login = async model => await apiService.post('/LoginAccount/Login', model)
export const loginAccountsApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  login,
}

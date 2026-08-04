import { loginAccountsApi } from "@/api/login-accounts-api";

const defaultUser = {
  token: null,
  email: null,
  avatarUrl: null,
  name: null,
  menus: [],
  recebedores: [],
  idsPerfil: [],
};

const keySession = "tltkn";


export default {
  _user: { ...defaultUser },

  loggedIn() {
    const user = this.getUserStorage();
    this._user = user ? { ...user } : { ...defaultUser };
    return Boolean(this._user.token);
  },
  

async logIn(email, password) {
  try {
    //Inicializa o resultado do login com valores padrão
    const loginResult = { isOk: true, isAuthorized: true, data: null };

    //Chama a API de login
    const ret = await loginAccountsApi.login({ email, password });

    // Verifica se a resposta da API indica sucesso
    if (!ret?.data?.success) {
      return {
        ...loginResult,
        isOk: false,
        isAuthorized: false,
        message: ret?.data?.errorMessage || ret?.data?.message || "Falha ao autenticar usuário."
      };
    }
    // Extrai os dados de login da resposta da API
    const loginData = ret.data.data;

    // Verifica se o token foi retornado pela API
    if (!loginData?.token) {
      return {
        //os tres pontos de js são para copiar o objeto loginResult e adicionar ou sobrescrever propriedades
        ...loginResult,
        isOk: false,
        isAuthorized: false,
        message: "Token não retornado pela API."
      };
    }
// Atualiza o objeto de usuário com os dados retornados pela API
    this._user = {
      ...defaultUser,
      email: loginData.email,
      token: loginData.token,
      name: loginData.email,
      userId: loginData.userId,
      userType: loginData.userType,
      institutionId: loginData.institutionId,
      menus: loginData.menus || [],
      idsPerfil: loginData.idsProfile || [],
      avatarUrl: loginData.avatar || null,
    };
// Salva os dados do usuário no sessionStorage
    console.log('user', this._user);

    this.saveUserStorage(this._user);

    // Retorna o resultado do login com os dados do usuário
    return {
      ...loginResult,
      data: this._user
    };

  } catch (error) {
    console.error("Erro ao fazer login:", error);

    return {
      isOk: false,
      isAuthorized: false,
      data: null,
      message: "Falha ao autenticar usuário."
    };
  }
},

  logOut() {
    sessionStorage.removeItem(keySession);
    this._user = { ...defaultUser };
  },

  returnMenusAuthorized() {
    var user = this.getUserStorage();
    return user.menus;
    //os dados estão na memoria. 
    // getuser pega do LocalStorege 


  },

  async getUser() {
    if (!this.loggedIn()) {
      return { isOk: false, message: "Usuário não está logado." };
    }

    try {
      const user = this.getUserStorage();
      this._user = user ? { ...user } : { ...defaultUser };
      return { isOk: true, data: this._user };
    } catch (error) {
      console.error("Erro ao obter usuário:", error);
      return { isOk: false, message: "Erro ao obter usuário." };
    }
  },

  async resetPassword(email) {
    try {
      return { isOk: true };
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      return { isOk: false, message: "Falha ao redefinir senha." };
    }
  },

  async changePassword(email, recoveryCode) {
    try {
      return { isOk: true };
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      return { isOk: false, message: "Falha ao alterar senha." };
    }
  },

  async createAccount(email, password) {
    try {
      return { isOk: true };
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      return { isOk: false, message: "Falha ao criar conta." };
    }
  },

  saveUserStorage(user) {
    try {
      sessionStorage.setItem(keySession, JSON.stringify(user));
    } catch (error) {
      console.error("Erro ao salvar usuário no storage:", error);
    }
  },

  getUserStorage() {
    const storedData = sessionStorage.getItem(keySession);
    if (!storedData) return null;

    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error("Erro ao ler usuário do storage:", error);
      return null;
    }
  },
};

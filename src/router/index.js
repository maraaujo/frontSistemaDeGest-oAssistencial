import { createRouter, createWebHistory } from 'vue-router';
import auth from '@/auth';



// Definição das rotas do front. Cada tela é carregada sob demanda (import dinâmico),
// gerando um arquivo JS (chunk) separado no build.
// Metas usadas:
//   - requiresAuth: exige usuário logado (ver o beforeEach abaixo);
//   - superAdmin: exclusiva do administrador da plataforma (usuário sem institutionId);
//   - layout: 'content' (com menu lateral e barra superior) ou 'blank' (tela limpa).
const router = createRouter({
  history: createWebHistory(),

  /** Ao trocar de rota, rola a página suavemente para o topo. */
  scrollBehavior: () => {
    // always scroll to top
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    // Raiz: manda para o login (que, se já houver sessão, segue para os lembretes).
    {
      path: '/',
      redirect: '/login',
    },

    // Telas internas da instituição (exigem login): início, dashboard, lembretes de
    // medicação, medicamentos programados, acolhidos, cadastros auxiliares, funcionários,
    // histórico/relatório de administração, agendamentos, assistente interno.
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/Home/index.vue'),
      meta: {
        requiresAuth: true,
        layout: 'content',
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index.vue'),
      meta: {
        requiresAuth: true,
        layout: 'content',
      },
    },
    {
      path: '/patient-reminders',
      name: 'patient-reminders',
      component: () => import('@/views/PatientReminders/index.vue'),
      meta: {
        requiresAuth: true,
        layout: 'content',
      },
    },
    {
  path: '/patient-medicines',
  name: 'patient-medicines',
  component: () => import('@/views/PatientMedicines/index.vue'),
  meta: {
        requiresAuth: true,
        layout: 'content',
      },
},

{
  path: '/patient-medicines/edit/:id',
  name: 'patient-medicines-edit',
  component: () => import('@/views/PatientMedicines/edit.vue'),
  meta: {
    requiresAuth: true,
    layout: 'content',
  },
},
{
  path: '/patient-medicines/new',
  name: 'patient-medicines-new',
  component: () => import('@/views/PatientMedicines/create.vue'),
  meta: {
    requiresAuth: true,
    layout: 'content',
  },
},
{
  path: '/patients',
  name: 'patients',
  component: () => import('@/views/Patients/index.vue'),
  meta: { requiresAuth: true,  layout: 'content', },
  
},
{
  path: '/patients-new',
  name: 'patients-new',
  component: () => import('@/views/Patients/Create.vue'),
  meta: { requiresAuth: true,  layout: 'content', },
  
},
{
  path: '/patients/details/:id',
  name: 'patient-details',
  component: () => import('@/views/Patients/details.vue'),
  meta: { requiresAuth: true ,
      layout: 'content',
  },
  
},
{
  path: '/patients/update/:id',
  name: 'patient-update',
  component: () => import('@/views/Patients/update.vue'),
  meta: { requiresAuth: true ,
      layout: 'content',
  },
  
},
    {
  path: '/medicamentos',
  name: 'medicamentos',
  component: () => import('@/views/Medicine/index.vue'),
  meta: { requiresAuth: true,  layout: 'content', },

},
{
  path: '/condicoes-clinicas',
  name: 'condicoes-clinicas',
  component: () => import('@/views/ClinicalConditions/index.vue'),
  meta: { requiresAuth: true,  layout: 'content', },

},
{
  path: '/departamentos',
  name: 'departamentos',
  component: () => import('@/views/Departments/index.vue'),
  meta: { requiresAuth: true, layout: 'content', },
},
{
  path: '/employees',
  name: 'employees',
  component: () => import('@/views/Employees/index.vue'),
  meta: { requiresAuth: true, layout: 'content', },
},
{
  path: '/employees-new',
  name: 'employees-new',
  component: () => import('@/views/Employees/create.vue'),
  meta: { requiresAuth: true, layout: 'content', },
},
{
  path: '/employees/details/:id',
  name: 'employees-details',
  component: () => import('@/views/Employees/details.vue'),
  meta: { requiresAuth: true, layout: 'content', },
},
{
  path: '/employees/update/:id',
  name: 'employees-update',
  component: () => import('@/views/Employees/update.vue'),
  meta: { requiresAuth: true, layout: 'content', },
},
{
  path: '/administered-medicines-history',
  name: 'administered-medicines-history',
  component: () => import('@/views/MedicationAdministrations/history.vue'),
  meta: { requiresAuth: true, layout: 'content', },
},
{
  path: '/daily-medication-report',
  name: 'daily-medication-report',
  component: () => import('@/views/MedicationAdministrations/daily-report.vue'),
  meta: { requiresAuth: true, layout: 'content', },
},
{
  // Versão para impressão/PDF do relatório diário: usa layout 'blank' (sem menu).
  path: '/daily-medication-report/print',
  name: 'daily-medication-report-print',
  component: () => import('@/views/MedicationAdministrations/daily-report-print.vue'),
  meta: { requiresAuth: true, layout: 'blank', },
},
{
  path: '/appointments',
  name: 'appointments',
  component: () => import('@/views/Appointments/index.vue'),
  meta: { requiresAuth: true, layout: 'content', },
},
{
  path: '/appointments/new',
  name: 'appointments-new',
  component: () => import('@/views/Appointments/create.vue'),
  meta: { requiresAuth: true, layout: 'content', },
},
{
  path: '/appointments/update/:id',
  name: 'appointments-update',
  component: () => import('@/views/Appointments/update.vue'),
  meta: { requiresAuth: true, layout: 'content', },
},
{
  path: '/internal-agent',
  name: 'internal-agent',
  component: () => import('@/views/InternalAgent/index.vue'),
  meta: { requiresAuth: true, layout: 'content', },
},

// Seção "Administração" (meta superAdmin): painel da plataforma e gestão de contas de
// acesso, visíveis só para o administrador da plataforma (sem instituição vinculada).
{
  path: '/admin/overview',
  name: 'admin-overview',
  component: () => import('@/views/AdminOverview/index.vue'),
  meta: { requiresAuth: true, superAdmin: true, layout: 'content', },
},
{
  // Versão para impressão/PDF do painel administrativo: usa layout 'blank' (sem menu).
  path: '/admin/overview/print',
  name: 'admin-overview-print',
  component: () => import('@/views/AdminOverview/print.vue'),
  meta: { requiresAuth: true, superAdmin: true, layout: 'blank', },
},
{
  path: '/admin/accounts',
  name: 'admin-accounts',
  component: () => import('@/views/AdminAccounts/index.vue'),
  meta: { requiresAuth: true, superAdmin: true, layout: 'content', },
},
{
  path: '/admin/accounts/new',
  name: 'admin-account-new',
  component: () => import('@/views/AdminAccounts/Create.vue'),
  meta: { requiresAuth: true, superAdmin: true, layout: 'content', },
},

// Perfil do usuário logado (acessado pelo menu do avatar).
{
  path: '/profile',
  name: 'profile',
  component: () => import('@/views/Profile/index.vue'),
  meta: { requiresAuth: true, layout: 'content', },
},

    // Telas públicas (sem requiresAuth, layout 'blank'): login, esqueci a senha e a
    // página 404, que captura qualquer caminho não reconhecido (pathMatch).
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        layout: 'blank',
      },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/ForgotPassword.vue'),
      meta: {
        layout: 'blank',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
      meta: {
        layout: 'blank',
      },
    },
  ],
})

// Guard de autenticação: bloqueia rotas com `requiresAuth` quando não há sessão
// (token em sessionStorage). Ao chegar deslogado, redireciona para o login
// preservando o destino em `redirect`. Usuário já logado não vê login/registro.
/**
 * Executado antes de cada navegação. Na ordem:
 * 1) rota com requiresAuth e sem sessão -> vai para o login (com ?redirect=destino);
 * 2) rota com superAdmin e usuário com institutionId -> vai para 'home';
 * 3) usuário logado indo para o login -> vai para 'patient-reminders';
 * caso contrário, libera a navegação (return true).
 * @param {import('vue-router').RouteLocationNormalized} to - rota de destino
 */
router.beforeEach(to => {
  const isLoggedIn = auth.loggedIn()

  if (to.meta?.requiresAuth && !isLoggedIn)
    return { name: 'login', query: { redirect: to.fullPath } }

  // Rotas administrativas (superAdmin) são exclusivas do administrador da
  // plataforma (sem instituição vinculada). Usuário de instituição é redirecionado.
  if (to.meta?.superAdmin) {
    const user = auth.getUserStorage()
    const isPlatformAdmin = !!user && (user.institutionId === null || user.institutionId === undefined)

    if (!isPlatformAdmin)
      return { name: 'home' }
  }

  if (isLoggedIn && to.name === 'login')
    return { name: 'patient-reminders' }

  return true
})

// Após um novo deploy, uma aba já aberta pode tentar carregar um chunk JS antigo
// (hash de build anterior) e falhar silenciosamente ao trocar de rota. Nesse caso,
// força um reload completo para pegar o build atual em vez de deixar a tela em branco.
/**
 * Trata erros de navegação. Se a mensagem indicar falha ao carregar um chunk (módulo
 * dinâmico), recarrega a página no destino (window.location) uma única vez: a marca
 * 'chunk-reload-attempted' no sessionStorage impede um loop de recarregamentos.
 * Outros erros são ignorados aqui.
 */
router.onError((error, to) => {
  const message = error?.message ?? ''
  const isChunkLoadError = /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(message)

  if (isChunkLoadError) {
    const alreadyReloaded = sessionStorage.getItem('chunk-reload-attempted')

    if (!alreadyReloaded) {
      sessionStorage.setItem('chunk-reload-attempted', '1')
      window.location.href = to.fullPath
    }
  }
})

/**
 * Após cada navegação concluída, apaga a marca 'chunk-reload-attempted', para que um
 * novo erro de chunk (num deploy futuro) possa disparar o reload novamente.
 */
router.afterEach(() => {
  sessionStorage.removeItem('chunk-reload-attempted')
})

export default router

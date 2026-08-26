import { createRouter, createWebHistory } from 'vue-router';



const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => {
    // always scroll to top
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
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
        layout: 'content',
      },
    },
    {
  path: '/patient-medicines',
  name: 'patient-medicines',
  component: () => import('@/views/PatientMedicines/index.vue'),
  meta: {
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
{
  path: '/admin/overview',
  name: 'admin-overview',
  component: () => import('@/views/AdminOverview/index.vue'),
  meta: { requiresAuth: true, layout: 'content', },
},
{
  path: '/admin/accounts',
  name: 'admin-accounts',
  component: () => import('@/views/AdminAccounts/index.vue'),
  meta: { requiresAuth: true, layout: 'content', },
},
{
  path: '/admin/accounts/new',
  name: 'admin-account-new',
  component: () => import('@/views/AdminAccounts/Create.vue'),
  meta: { requiresAuth: true, layout: 'content', },
},
{
  path: '/profile',
  name: 'profile',
  component: () => import('@/views/Profile/index.vue'),
  meta: { requiresAuth: true, layout: 'content', },
},
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        layout: 'blank',
      },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue'),
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

// Após um novo deploy, uma aba já aberta pode tentar carregar um chunk JS antigo
// (hash de build anterior) e falhar silenciosamente ao trocar de rota. Nesse caso,
// força um reload completo para pegar o build atual em vez de deixar a tela em branco.
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

router.afterEach(() => {
  sessionStorage.removeItem('chunk-reload-attempted')
})

export default router

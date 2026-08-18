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
      component: () => import('@/views/Dashboard/index.vue'),
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

export default router

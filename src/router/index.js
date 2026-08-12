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
  path: '/patient-medicines-create',
  name: 'patient-medicines-create',
  component: () => import('@/views/PatientMedicines/create.vue'),
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

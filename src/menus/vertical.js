export default [
  { heading: 'Menus' },
  {
    name: 'Inicio',
    icon: 'mdi-home-outline',
    to: { name: 'home' },
  },
  {
    name: 'Dashboard',
    icon: 'mdi-view-dashboard-outline',
    to: { name: 'dashboard' },
  },
  {
    name: 'Próximos medicamentos',
    icon: 'mdi-clock-alert-outline',
    to: { name: 'patient-reminders' },
  },
  {
    name: 'Agendamentos',
    icon: 'mdi-calendar-clock-outline',
    to: { name: 'appointments' },
  },
  {
    name: 'Administração de medicamentos',
    icon: 'mdi-clock-outline',
    to: { name: 'patient-medicines' },  
  },
  {
    name: 'Paciente',
    icon: 'mdi-account-multiple-outline',
    to: { name: 'patients' },
  },
  {
    name: 'Medicamentos',
    icon: 'mdi-pill',
    to: { name: 'medicamentos' },
  },
  {
    name: 'Condições clínicas',
    icon: 'mdi-medical-bag',
    to: { name: 'condicoes-clinicas' },
  },
  {
    name: 'Departamentos',
    icon: 'mdi-office-building-outline',
    to: { name: 'departamentos' },
  },
  {
    name: 'Funcionários',
    icon: 'mdi-account-tie',
    to: { name: 'employees' },
  },
  {
    name: 'Histórico de medicação',
    icon: 'mdi-history',
    to: { name: 'administered-medicines-history' },
  },
  {
    name: 'Assistente Interno',
    icon: 'mdi-robot-outline',
    to: { name: 'internal-agent' },
  },
  { heading: 'Administração' },
  {
    name: 'Painel Administrativo',
    icon: 'mdi-view-dashboard-variant-outline',
    to: { name: 'admin-overview' },
  },
]

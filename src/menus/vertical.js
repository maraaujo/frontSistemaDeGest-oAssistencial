export default [
  { heading: 'Menus' },
  {
    name: 'Inicio',
    icon: 'mdi-account-injury',
    to: { name: 'patient-reminders' },
  },
  {
    name: 'Agendamento',
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
    name: 'Funcionários',
    icon: 'mdi-account-tie',
    to: { name: 'employees' },
  },
]

import { apiService } from './api-service'

// Manutenção de dados (limpezas globais) — consome MaintenanceController no backend.
// Todas as rotas são restritas ao administrador da plataforma (policy "SaasAdmin").

/** Quantidade de registros de cada tabela operacional, somando todas as instituições (GET /Maintenance/Summary). */
const getSummary = async () => await apiService.get('/Maintenance/Summary')

/** Apaga todos os acolhidos e seus dependentes, de todas as instituições (DELETE /Maintenance/DeleteAllPatients). */
const deleteAllPatients = async () => await apiService.delete('/Maintenance/DeleteAllPatients')

/**
 * Zera os dados operacionais do sistema: acolhidos e dependentes, funcionários, departamentos e
 * medicamentos. Mantém contas de acesso, instituições, planos e cadastros de apoio
 * (DELETE /Maintenance/ResetSystemData).
 */
const resetSystemData = async () => await apiService.delete('/Maintenance/ResetSystemData')

export const maintenanceApi = {
  getSummary,
  deleteAllPatients,
  resetSystemData,
}

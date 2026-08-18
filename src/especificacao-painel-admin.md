# Especificação — Painel Administrativo (Back-office SaaS)

> **Contexto para o gerador de código:** Este documento especifica a tela de *Visão geral* do console administrativo de um SaaS de gestão de administração de medicamentos em ILPIs (Instituições de Longa Permanência para Idosos). Implemente no padrão, linguagem, framework e design system já existentes no projeto. Onde este documento sugere nomes de campos/endpoints, adapte à convenção do código atual. Todos os números citados são exemplos ilustrativos — o que importa é a **estrutura, as métricas e as regras de cálculo**.

## 1. Objetivo

Dar à administração do SaaS uma visão única de: (a) quais instituições têm assinatura ativa, (b) evolução de novas assinaturas comparada ao período anterior, (c) faturamento, e (d) sinais de uso do produto (idosos gerenciados, doses administradas, adesão). A tela é somente leitura (dashboard); ações de gestão (editar assinatura, suspender, etc.) ficam nas telas de detalhe.

## 2. Escopo

**Incluir:** faturamento, assinaturas ativas, novas assinaturas vs. período anterior, situação das contas, movimento de novas × canceladas, faturamento por plano, idosos gerenciados, doses administradas, adesão, e a tabela de instituições.

**NÃO incluir (excluído explicitamente):**

- Receita recorrente (MRR / ARR)
- ARPA (receita média por conta)
- Inadimplência (valor em R$)
- Churn de receita (% de receita perdida)

> Observação: "novas × canceladas" continua no escopo porque é **contagem de instituições** (movimento de assinaturas), não churn de receita. O **status "inadimplente"** de uma conta permanece como estado da assinatura (faz parte de "quais instituições estão ativas"), mas **não** há card/métrica de valor de inadimplência.

## 3. Layout

Três regiões:

1. **Sidebar** (lateral esquerda, fixa): logo + navegação agrupada.
   - Grupo *Gestão*: Visão geral (ativo), Assinaturas, Instituições, Faturamento.
   - Grupo *Produto*: Uso & adesão, Contas & usuários, Alertas.
   - Grupo *Sistema*: Configurações.
   - Rodapé: usuário logado (avatar, nome, papel).
2. **Topbar** (superior, fixa): título da tela + breadcrumb ("atualizado há X min"), filtro de período (segmented control), botão exportar, botão alternar tema claro/escuro.
3. **Conteúdo**: grade responsiva com os blocos das seções 5 a 8.

Responsivo: em telas ≤1080px os cards passam a 2 colunas e os pares de gráficos empilham; ≤720px a sidebar recolhe.

## 4. Filtro global de período

Segmented control com três opções: **30 dias**, **90 dias** (padrão), **12 meses**. O valor selecionado é o parâmetro `period` de todas as consultas da tela. Toda comparação "vs. período anterior" usa a janela imediatamente anterior de mesmo tamanho.

## 5. KPIs (cards de indicador)

Cada card tem: rótulo, valor principal, e um subtexto com comparação/contexto. A comparação mostra variação (▲/▼) com cor semântica (verde = melhora, vermelho = piora — atenção: para "novas assinaturas" mais é melhor; a direção boa depende da métrica).

### Faixa principal

| # | Rótulo | Definição | Cálculo | Comparação |
|---|--------|-----------|---------|------------|
| 1 | **Faturamento (período)** | Total faturado no período selecionado | Soma dos valores das faturas/cobranças com competência dentro de `period` | % vs. período anterior |
| 2 | **Assinaturas ativas** | Nº de instituições com assinatura ativa hoje | `count(subscriptions WHERE status='active')` | Variação líquida no período (novas − canceladas); mostrar também "X em trial" |
| 3 | **Novas assinaturas** | Nº de assinaturas iniciadas no período | `count(subscriptions WHERE started_at ∈ period)` | **% e valor absoluto vs. período anterior** (métrica-chave) |
| 4 | **Idosos gerenciados** | Total de residentes ativos sob gestão nas contas | `count(residents WHERE active)` | Média por instituição (`total / nº instituições ativas`) |

### Faixa secundária

| # | Rótulo | Definição | Cálculo |
|---|--------|-----------|---------|
| 5 | **Doses administradas (mês)** | Total de doses registradas no mês corrente | `count(dose_events WHERE administered_at ∈ mês)`; subtexto = **% no horário previsto** = `doses_no_prazo / total` |
| 6 | **Instituições em trial** | Contas em período de teste | `count(subscriptions WHERE status='trial')` |
| 7 | **Adesão média** | Média da taxa de adesão das contas ativas | média de `doses_no_prazo / doses_previstas` por instituição |
| 8 | **Cuidadores ativos** | Usuários operacionais ativos nas contas (últimos 30 dias) | `count(distinct users WHERE role='caregiver' AND last_active ≥ hoje-30d)` |

> Se algum dado da faixa secundária ainda não existir no sistema, o card pode ser ocultado por feature flag em vez de mostrar zero.

## 6. Gráficos

Regras gerais: um eixo de valor por gráfico (nunca eixo duplo); tooltip on-hover em toda marca; legenda presente quando há ≥2 séries; grade/eixos discretos; suportar tema claro e escuro.

### 6.1 Evolução do faturamento
- **Tipo:** linha com área preenchida (série temporal).
- **Eixo X:** meses (últimos 12, ou granularidade compatível com `period`).
- **Eixo Y:** faturamento no mês (R$).
- **Série:** 1 (faturamento). Marcadores em cada ponto.
- **Tooltip:** mês + valor + variação % vs. mês anterior.
- **Extra:** badge opcional com meta de faturamento.

### 6.2 Novas × canceladas
- **Tipo:** barras agrupadas por mês (2 barras por mês).
- **Séries:** "Novas" e "Canceladas" (contagem de instituições).
- **Eixo Y:** nº de instituições.
- **Tooltip:** mês + série + contagem.
- **Objetivo:** visualizar o saldo líquido de assinaturas ao longo do tempo.

### 6.3 Faturamento por plano
- **Tipo:** barras horizontais (uma por plano) com participação percentual.
- **Dados por plano:** nome, faturamento no período, nº de contas, % do total.
- **Ordenação:** do maior para o menor faturamento.
- **Planos de referência:** Básico, Profissional, Enterprise (adaptar aos planos reais).

### 6.4 Assinaturas por situação
- **Tipo:** donut (rosca) com total no centro.
- **Fatias:** Ativas, Trial, Inadimplentes, Em cancelamento (contagem por status).
- **Legenda:** rótulo + contagem por fatia.
- **Tooltip:** situação + contagem + %.

## 7. Tabela de instituições

Lista as contas com sua saúde. Ordenação padrão por **faturamento mensal** (desc); permitir ordenar por qualquer coluna.

| Coluna | Conteúdo | Formato |
|--------|----------|---------|
| Instituição | Nome da conta | texto, destaque |
| Plano | Plano contratado | rótulo |
| Faturamento mensal | Valor faturado/mês da conta | moeda R$, alinhado à direita, tabular |
| Idosos | Nº de residentes ativos | número, direita |
| Adesão | Taxa de adesão da conta | barra de progresso + % (cor: ≥95% verde, 90–94% amarelo, <90% vermelho) |
| Situação | Status da assinatura | badge (ver seção 8) |
| Renovação | Data da próxima renovação ou aviso ("vencido há N d", "trial · N d rest.", "encerra DD mmm") | texto |

Recursos: paginação ou scroll; busca por nome; filtro por situação e por plano. Linha clicável abre o detalhe da instituição (fora do escopo desta tela).

## 8. Enum de situação da assinatura

| Código | Rótulo | Cor semântica | Significado |
|--------|--------|---------------|-------------|
| `active` | Ativa | verde/sucesso | Assinatura em dia |
| `trial` | Trial | azul/informativo | Em período de teste |
| `past_due` | Inadimplente | amarelo/alerta | Cobrança em atraso, ainda ativa |
| `canceling` | Cancelando | vermelho/crítico | Cancelamento agendado / fim de contrato |

Badges sempre com **ícone/ponto + rótulo** (nunca cor sozinha), por acessibilidade.

## 9. Modelo de dados (entidades sugeridas)

Adapte aos modelos existentes; abaixo o mínimo que a tela consome.

```
Institution      { id, name, plan_id, status, created_at, renews_at }
Subscription     { id, institution_id, plan_id, status, started_at, canceled_at, mrr_excluded... }
Plan             { id, name, monthly_price }
Invoice          { id, institution_id, amount, competence_date, paid_at }
Resident         { id, institution_id, active }
DoseEvent        { id, institution_id, scheduled_at, administered_at, on_time (bool) }
User             { id, institution_id, role, last_active_at }
```

> Ignore campos de receita recorrente (MRR/ARPA/churn de receita) — não são usados nesta tela.

## 10. Endpoints / consultas sugeridas

Agnóstico de transporte (REST/GraphQL/RPC). Todos aceitam `period` (`30d` | `90d` | `12m`).

- `GET /admin/overview/kpis?period=` → objeto com os cards das seções 5 (faturamento do período, assinaturas ativas + variação líquida, novas assinaturas + comparação, idosos gerenciados, doses do mês + % no prazo, trials, adesão média, cuidadores ativos).
- `GET /admin/overview/revenue-trend?period=` → série mensal `[{ month, amount }]`.
- `GET /admin/overview/subscription-movement?period=` → `[{ month, new, canceled }]`.
- `GET /admin/overview/revenue-by-plan?period=` → `[{ plan, amount, accounts }]`.
- `GET /admin/overview/subscription-status` → `[{ status, count }]`.
- `GET /admin/institutions?sort=revenue_desc&search=&status=&plan=&page=` → linhas da tabela (seção 7).

Exemplo de resposta dos KPIs:

```json
{
  "period": "90d",
  "revenue": { "value": 128540, "prev": 118650, "change_pct": 8.3 },
  "active_subscriptions": { "value": 142, "net_change": 16, "trials": 9 },
  "new_subscriptions": { "value": 18, "prev": 12, "change_pct": 50.0 },
  "managed_residents": { "value": 3847, "avg_per_institution": 27 },
  "doses_this_month": { "value": 214300, "on_time_pct": 97.4 },
  "avg_adherence_pct": 96.1,
  "active_caregivers": 512
}
```

## 11. Regras de cálculo

- **Faturamento do período** = soma de `Invoice.amount` cuja `competence_date` cai em `period` (usar `paid_at` se a métrica desejada for caixa em vez de competência — decidir conforme a contabilidade do projeto).
- **Variação vs. período anterior** = `(atual − anterior) / anterior × 100`, arredondada a 1 casa. Tratar `anterior = 0` como "—" (sem divisão).
- **Novas assinaturas** = `count(Subscription.started_at ∈ period)`.
- **Canceladas** = `count(Subscription.canceled_at ∈ period)`.
- **Variação líquida de ativas** = novas − canceladas no período.
- **% no prazo** = `count(DoseEvent.on_time) / count(DoseEvent)` no mês.
- **Adesão da conta** = doses administradas no prazo ÷ doses previstas, no período.
- **Faturamento por plano %** = faturamento do plano ÷ faturamento total do período.

## 12. Estados de UI

- **Carregando:** skeleton nos cards, gráficos e linhas da tabela.
- **Vazio:** mensagem por bloco ("Sem dados no período") em vez de gráfico em branco.
- **Erro:** card/gráfico mostra estado de erro com botão "tentar novamente"; um bloco com erro não derruba a tela inteira.
- **Sem permissão:** a tela exige papel administrativo; caso contrário, redirecionar.

## 13. Acessibilidade e temas

- Suportar tema **claro e escuro** (o toggle na topbar; respeitar também a preferência do SO).
- Contraste mínimo AA para texto; badges e séries nunca dependem só de cor (ícone/rótulo sempre presentes).
- Gráficos com `role="img"` e `aria-label` descritivo; tooltips acessíveis por foco quando possível.
- Números em colunas usam fonte tabular (alinhamento vertical).

## 14. Fora de escopo desta tela

Edição de assinaturas, emissão/gestão de faturas, CRUD de instituições e usuários, e os detalhes por instituição — todos em telas próprias, alcançáveis pela navegação e pelo clique nas linhas da tabela.

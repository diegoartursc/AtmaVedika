# 🎯 VEDA — Objetivos Estratégicos

## Objetivo Principal
Lançar o VEDA como o primeiro app de Jyotish (astrologia védica) com inteligência artificial no Brasil, alcançando 10.000 usuários nos primeiros 3 meses.

---

## Objetivos por Horizonte

### Curto Prazo — 30 dias
| # | Objetivo | Métrica | Status |
|---|----------|---------|--------|
| 1 | App funcional com fluxo completo | Onboarding → Mapa → Chat sem erros | ✅ |
| 2 | Backend conectado e estável | Uptime > 99%, latência < 2s | ⚠️ Deploy pendente |
| 3 | Primeira leitura personalizada | GPT-4 gerando com dados reais do SwissEph | ✅ Implementado |
| 4 | Design premium coerente | Todas as telas seguem design system | ✅ |
| 5 | Paywall funcional | Limite de 7 msgs, CTA de upgrade | ✅ Frontend pronto |

### Médio Prazo — 90 dias
| # | Objetivo | Métrica |
|---|----------|---------|
| 1 | 1.000 downloads na App Store/Play Store | Tracking via analytics |
| 2 | Retenção D7 > 30% | 30% dos usuários voltam após 7 dias |
| 3 | Leitura diária funcionando | Push notification + sky message diário |
| 4 | Stripe integrado | Conversão gratuito→pago > 5% |
| 5 | NPS > 50 | Survey in-app após 7ª pergunta |

### Longo Prazo — 6 meses
| # | Objetivo | Métrica |
|---|----------|---------|
| 1 | 10.000 usuários ativos | DAU > 2.000 |
| 2 | Relatório anual PDF | Geração automatizada via PDFKit |
| 3 | Relatório de compatibilidade | 2 mapas natais comparados |
| 4 | Comunidade | Waiting list / grupo exclusivo |
| 5 | Receita recorrente | MRR > R$ 10.000 |

---

## KPIs de Produto

| KPI | Meta | Como Medir |
|-----|------|------------|
| Completion Rate do Onboarding | > 80% | Step 2 → Step 4 completado |
| Mensagens por sessão | > 3 | Média de msgs enviadas por visita |
| Tempo médio na primeira leitura | > 30s | Tempo entre step 4 render e CTA click |
| Taxa de retorno D1 | > 50% | Usuários que voltam no dia seguinte |
| Taxa de conversão Premium | > 5% | Usuários que atingem paywall e assinam |
| Churn mensal | < 15% | Cancelamentos / assinantes ativos |

---

## Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| OpenAI API instável | Chat para | Fallback demo + cache de respostas frequentes |
| SwissEph cálculo incorreto | Credibilidade zero | Validar contra 3 softwares de referência |
| Custo GPT-4 alto | Margem negativa | Limitar tokens, usar GPT-3.5 para consultas simples |
| Apple/Google rejeitam | Sem distribuição | Avisos claros "entretenimento", sem promessas médicas |
| Ninguém paga | Receita zero | Experimentar preços, oferecer trial de 3 dias |

# 🧰 VEDA — Skills & Competências do Projeto

## Stack Técnico

### Frontend (React Native / Expo)
| Skill | Nível | Onde é Usado |
|-------|-------|-------------|
| React Native | Core | Todo o app mobile |
| Expo Router | Core | Navegação (Stack + Tabs) |
| TypeScript | Core | Tipagem em todos os arquivos |
| Zustand | Core | Estado global (userStore, chatStore) |
| Expo LinearGradient | Visual | Backgrounds, cards |
| React Native Animated | Visual | Fade, slide, spin, typewriter |
| Google Fonts (Expo) | Visual | Playfair Display + Inter |

### Backend (Node.js / Express)
| Skill | Nível | Onde é Usado |
|-------|-------|-------------|
| Express.js | Core | API REST |
| Prisma ORM | Core | Acesso ao banco de dados |
| SQLite / PostgreSQL | Core | Armazenamento |
| Swiss Ephemeris | Especializado | Cálculo de mapa natal real |
| OpenAI API (GPT-4) | Core | Respostas da IA |
| JWT + bcrypt | Core | Autenticação |
| Nominatim API | Auxiliar | Geocoding de cidades |

### Infraestrutura (Futuro)
| Skill | Status | Propósito |
|-------|--------|-----------|
| Redis (ioredis) | Instalado, não usado | Cache de mapas natais |
| Stripe | Instalado, não integrado | Pagamentos/Subscription |
| Firebase Admin | Instalado, não usado | Push Notifications |
| AWS S3 | Instalado, não usado | Storage de PDFs |
| PDFKit | Instalado, não usado | Geração de relatórios |
| node-cron | Instalado, não usado | Jobs diários (sky messages) |

---

## Competências de Domínio

### Astrologia Védica (Jyotish)
| Conceito | Implementado? | Descrição |
|----------|---------------|-----------|
| Mapa Natal (Rashi) | ✅ | Posição dos 9 planetas nos 12 signos |
| Nakshatras | ✅ | 27 constelações lunares com régentes |
| Vimshottari Dasha | ✅ | Sistema de timing kármico (120 anos) |
| Ascendente (Lagna) | ✅ | Signo nascente calculado pela hora/local |
| Trânsitos Planetários | ⚠️ Parcial | Posição atual da Lua vs mapa natal |
| Casas (Bhavas) | ⚠️ Parcial | Calculado mas não interpretado no frontend |
| Aspectos | ❌ | Não implementado |
| Cartas Divisionais | ❌ | Navamsha, Dasamsa etc. |

### Inteligência Artificial
| Capacidade | Status | Descrição |
|------------|--------|-----------|
| Primeira Leitura Personalizada | ✅ | GPT-4 com contexto do mapa natal |
| Chat Contínuo com Memória | ✅ | Últimas 10 mensagens como contexto |
| Leitura Diária | ⚠️ Frontend mock | Backend pronto, cron job pendente |
| Prompt Engineering | ✅ | System prompt detalhado com personalidade |
| Guardrails | ✅ | Limites de tokens, temperatura, penalidades |

### Design
| Competência | Status |
|------------|--------|
| Design System completo (tokens) | ✅ |
| Componentes reutilizáveis | ✅ MysticCard, PremiumButton, DailyReading |
| Microanimações (fade, slide, spin) | ✅ |
| Typewriter effect | ✅ |
| Typing indicator | ✅ |
| Dark theme premium | ✅ |
| Responsividade mobile-first | ✅ |

---

## Mapa de Dependências

```
Frontend ──→ Zustand stores ──→ API Service ──→ Backend
                                       ↓
                                 Express Routes
                                       ↓
                          ┌────────────┼────────────┐
                          ↓            ↓            ↓
                      Prisma/DB   OpenAI GPT-4  Swiss Eph
                          ↓            ↓            ↓
                      User Data    Respostas    Mapa Natal
                      Messages     Leituras     Posições
                      Charts                   Nakshatras
                                               Dashas
```

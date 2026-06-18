# 🚛 LogiDash — Frontend

Interface web do LogiDash, dashboard de gestão e análise de abastecimentos de frota. Consome a [API do LogiDash Backend](https://github.com/seu-usuario/logidash-backend) e exibe os dados em gráficos interativos com filtros por período, placa e motorista.

---

## 💡 Sobre o projeto

O frontend nasceu junto com o backend como parte do mesmo projeto pessoal. O objetivo foi construir uma interface que tornasse os dados de abastecimento realmente utilizáveis — sem planilhas, sem exportações manuais, direto no browser.

---

## 🧰 Tecnologias

| Categoria | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS |
| Gráficos | Recharts |
| HTTP Client | Axios |
| Calendário | react-day-picker |
| Ícones | Lucide React |

---

## ✨ Funcionalidades

### 📊 Dashboard
- Gráficos de pizza com consumo e gasto **interno vs externo**
- Detalhamento por tipo de combustível (Diesel, Arla Granel, Arla Balde, Gasolina)
- Preço médio por litro de cada combustível
- **Top 10 postos** e **Top 10 motoristas** por volume consumido com tooltip detalhado
- Gráfico de **evolução diária** alternando entre valor (R$) e litros
- Gráfico de **preço médio do diesel** ao longo do período

### 🔍 Filtros
- Seleção de período com **calendário de intervalo** (range picker)
- Filtro por placa e por motorista com busca instantânea (sem recarregar a página)
- **Cache por período** via `sessionStorage`: trocar filtro de placa não refaz a requisição ao backend
- Limpeza de filtros com restauração do estado original

### 🔐 Autenticação
- Login com email e senha via cookie HttpOnly (gerenciado pelo backend)
- **Middleware do Next.js** protegendo todas as rotas: redireciona para `/login` se não houver cookie
- Usuário já autenticado é redirecionado para o dashboard ao acessar `/login`
- Logout remove o cookie via Route Handler e redireciona para a tela de login
- Proteção de rota no cliente para páginas exclusivas de ADMIN (`RotaAdmin`)

### 👤 Gestão de Usuários (ADMIN)
- Listagem com status, perfil e ações
- Modal de criação e edição com validação de campos obrigatórios
- Ativação e desativação de conta com toggle visual
- Senha opcional na edição (mantém a atual se deixada em branco)

### 📱 Responsividade
- Sidebar colapsável em mobile com menu hamburger
- Filtros em drawer deslizante pelo bottom da tela em mobile
- Layout adaptado para desktop e mobile em todas as telas

---

## 🏗️ Arquitetura

```
src/
├── app/
│   ├── api/
│   │   ├── auth/login/     # Route Handler — proxy do login para o backend
│   │   └── auth/logout/    # Route Handler — proxy do logout para o backend
│   ├── login/              # Página de login
│   ├── usuarios/           # Página de gestão de usuários (ADMIN)
│   └── page.tsx            # Dashboard principal
├── components/
│   ├── charts/             # PizzaConsumo, PizzaValor, RankingPostos, RankingMotoristas, EvolucaoDiaria, PrecoDiesel
│   └── layout/             # Sidebar, Header, RotaAdmin
├── lib/
│   └── api.ts              # Axios + todas as chamadas ao backend
├── types/                  # Interfaces TypeScript organizadas por domínio
└── middleware.ts            # Proteção de rotas via cookie
```

---

## 🔒 Decisões de Segurança

### Por que Route Handlers para login e logout?
O cookie `auth_token` é `HttpOnly` — o JavaScript não consegue lê-lo nem enviá-lo manualmente. Para que o Next.js receba e repasse o `Set-Cookie` do backend corretamente, o login e o logout passam por Route Handlers no servidor (`/api/auth/login` e `/api/auth/logout`), que fazem o proxy da requisição e repassam o header de cookie para o browser.

### Por que middleware no Next.js?
O `middleware.ts` roda no edge, antes de qualquer página ser renderizada. Ele lê o cookie `auth_token` diretamente da requisição e redireciona para `/login` se não existir — sem precisar de lógica de guarda em cada página individualmente.

### Por que `localStorage` para nome e role?
O token JWT fica no cookie HttpOnly (inacessível ao JS). Apenas dados não-sensíveis como nome e role são salvos no `localStorage`, usados só para exibição na interface e para controle de acesso visual no cliente. O controle real de autorização é feito pelo backend.

---

## ⚙️ Como executar

### Pré-requisitos
- Node.js 18+
- Backend do LogiDash rodando

### Configuração (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Executando

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build de produção
npm run build
npm start
```

A aplicação sobe em `http://localhost:3000`.

---

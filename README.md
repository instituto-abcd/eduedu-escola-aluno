<h1 align="center">EduEdu+ Aluno</h1>

<p align="center">
  Interface do aluno da plataforma EduEdu+, um sistema de avaliação e acompanhamento de alfabetização para escolas brasileiras.
</p>

<p align="center">
  <a href="#sobre-o-projeto">Sobre</a> &bull;
  <a href="#tecnologias">Tecnologias</a> &bull;
  <a href="#pré-requisitos">Pré-requisitos</a> &bull;
  <a href="#instalação">Instalação</a> &bull;
  <a href="#estrutura-do-projeto">Estrutura</a> &bull;
  <a href="#scripts-disponíveis">Scripts</a> &bull;
  <a href="#variáveis-de-ambiente">Ambiente</a> &bull;
  <a href="#contribuindo">Contribuindo</a> &bull;
  <a href="#licença">Licença</a>
</p>

---

## Sobre o Projeto

O **EduEdu+ Aluno** é o portal do estudante da plataforma educacional EduEdu+. Voltado para crianças em fase de alfabetização, o sistema oferece uma interface lúdica e acessível para realização de avaliações diagnósticas e atividades educativas gamificadas.

### Funcionalidades Principais

- **Login simplificado** &mdash; Fluxo de autenticação visual adaptado para crianças, com seleção de turma, série e aluno por avatares
- **Avaliações diagnósticas** &mdash; Interface interativa para realização de provas que avaliam eixos de alfabetização
- **Trilha de Planetas** &mdash; Sistema de progressão gamificado com atividades educativas organizadas em "planetas"
- **Sistema de conquistas** &mdash; Badges e recompensas visuais para motivar o aprendizado
- **Feedback audiovisual** &mdash; Animações Lottie e efeitos sonoros para uma experiência imersiva
- **Suporte offline** &mdash; Modo de desenvolvimento offline para testes sem conexão

### Repositórios Relacionados

| Repositório                                                                      | Descrição                                          |
| -------------------------------------------------------------------------------- | -------------------------------------------------- |
| [eduedu-escola-setup](https://github.com/instituto-abcd/eduedu-escola-setup)     | Pacote de instalação e orquestração (Docker)       |
| [eduedu-escola-backend](https://github.com/instituto-abcd/eduedu-escola-backend) | API backend (NestJS + Prisma + MongoDB)            |
| [eduedu-escola-admin](https://github.com/instituto-abcd/eduedu-escola-admin)     | Interface administrativa (diretores e professores) |

---

## Tecnologias

| Categoria        | Tecnologia                                                     |
| ---------------- | -------------------------------------------------------------- |
| Framework        | [React](https://react.dev/) 18                                 |
| Build Tool       | [Vite](https://vitejs.dev/) 4                                  |
| Linguagem        | TypeScript 5 (strict mode)                                     |
| UI Components    | [Mantine](https://mantine.dev/) v8                             |
| Estilos          | [Tailwind CSS](https://tailwindcss.com/) 3                     |
| Estado Global    | [Zustand](https://zustand-demo.pmnd.rs/) + persist middleware  |
| Data Fetching    | [TanStack React Query](https://tanstack.com/query) v4          |
| HTTP Client      | [Axios](https://axios-http.com/)                               |
| Roteamento       | [React Router DOM](https://reactrouter.com/) v6                |
| Validação        | [Zod](https://zod.dev/)                                        |
| Animações        | [Framer Motion](https://www.framer.com/motion/) + react-lottie |
| Áudio            | [Howler.js](https://howlerjs.com/)                             |
| Drag & Drop      | [@dnd-kit](https://dndkit.com/)                                |
| Variáveis de Env | [@t3-oss/env-core](https://env.t3.gg/)                         |

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [npm](https://www.npmjs.com/) 8+
- Backend rodando localmente ou acessível (veja [eduedu-escola-backend](https://github.com/instituto-abcd/eduedu-escola-backend))

---

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/instituto-abcd/eduedu-escola-aluno.git
cd eduedu-escola-aluno
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

O projeto usa um arquivo `public/config.js` para configuração em runtime. Para desenvolvimento, edite este arquivo:

```javascript
window.ENV = {
  VITE_API_URL: "http://localhost:3000",
  VITE_ADMIN_URL: "http://localhost:5173",
};
```

Alternativamente, crie um arquivo `.env` na raiz:

```env
VITE_API_URL=http://localhost:3000
VITE_ADMIN_URL=http://localhost:5174
```

### 4. Inicie o servidor de desenvolvimento

```bash
# Modo desenvolvimento (conecta ao backend)
npm run dev

```

A aplicação estará disponível em `http://localhost:5173`.

---

## Estrutura do Projeto

```
src/
├── main.tsx                 # Entry point da aplicação
├── App.tsx                  # Componente raiz
├── env.ts                   # Configuração de variáveis de ambiente
│
├── api/                     # Camada de API (Axios + React Query)
│   ├── base.ts              # Classe base com configuração Axios
│   ├── student.ts           # API de alunos
│   ├── exam.ts              # API de avaliações
│   ├── planet.ts            # API de planetas/atividades
│   ├── school-class.ts      # API de turmas
│   └── user.ts              # API de usuários
│
├── pages/                   # Páginas da aplicação
│   ├── Login/               # Fluxo de login (seleção de turma/aluno)
│   ├── Dashboard/           # Tela inicial do aluno
│   ├── Exam/                # Realização de avaliações
│   ├── Planet/              # Trilha de planetas
│   ├── Intro/               # Tela de introdução
│   └── Debug/               # Ferramentas de debug (dev only)
│
├── components/              # Componentes reutilizáveis
│
├── stores/                  # Stores Zustand
│   ├── student.ts           # Estado do aluno logado
│   ├── exam-progress.ts     # Progresso da prova atual
│   ├── planets.store.ts     # Estado dos planetas
│   ├── audio.ts             # Configurações de áudio
│   └── new-award.ts         # Notificação de conquistas
│
├── hooks/                   # Custom hooks
│
├── constants/               # Constantes (paths, query keys)
│
├── assets/                  # Assets estáticos
│   ├── audio/               # Efeitos sonoros e feedbacks
│   ├── awards/              # Imagens dos badges
│   ├── bgs/                 # Backgrounds
│   ├── lotties/             # Animações Lottie
│   └── logos/               # Logos EduEdu
│
├── styles/                  # Estilos globais e tema Mantine
│
├── providers/               # Context providers
│
├── routes/                  # Definições de rotas
│
└── utils/                   # Funções utilitárias
    └── cx.ts                # Utilitário clsx + tailwind-merge

config/
└── env.schema.ts            # Schema Zod para variáveis de ambiente
```

---

## Scripts Disponíveis

| Comando                  | Descrição                                           |
| ------------------------ | --------------------------------------------------- |
| `npm run dev`            | Inicia em modo desenvolvimento (conecta ao backend) |
| `npm run build`          | Compila para produção                               |
| `npm run preview`        | Preview do build de produção                        |
| `npm run lint`           | Executa ESLint (max-warnings 0)                     |
| `npm run check-deadcode` | Detecta exports não utilizados com ts-prune         |

---

## Variáveis de Ambiente

| Variável         | Descrição                    | Exemplo                 |
| ---------------- | ---------------------------- | ----------------------- |
| `VITE_API_URL`   | URL do backend EduEdu+       | `http://localhost:3000` |
| `VITE_ADMIN_URL` | URL do painel administrativo | `http://localhost:5174` |

**Modos de execução:**

- `development` &mdash; Conecta ao backend configurado
- `production` &mdash; Build otimizado para produção

---

## Padrões de Código

### Imports

Use o alias `~/` para imports absolutos:

```typescript
// Correto
import { useStudent } from "~/stores/student";
import { ExamAPI } from "~/api/exam";

// Evitar
import { useStudent } from "../../../stores/student";
```

### Componentes

```typescript
export function MeuComponente({ prop }: MeuComponenteProps) {
  return <div>...</div>;
}
```

### Stores Zustand

```typescript
export const useMinhaStore = create<MinhaStore>()(
  persist(
    (set) => ({
      valor: "",
      atualizar: (v) => set({ valor: v }),
    }),
    { name: "minha_store" }
  )
);
```

### Hooks de API

```typescript
export function useGetAluno(id: string) {
  const handler = useCallback(() => AlunoAPI.get(id), [id]);
  return useQuery([KEY.ALUNO, id], handler);
}
```

---

## Git Workflow

O projeto segue o modelo **Gitflow**:

![Gitflow](https://github.com/user-attachments/assets/6be6f745-4805-432c-a09d-01fc5643c7a3)

- `main` &mdash; Branch de produção
- `staging` &mdash; Branch de homologação
- `development` &mdash; Branch de desenvolvimento
- `feature/*` &mdash; Branches de funcionalidades
- `hotfix/*` &mdash; Correções urgentes

---

## Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`)
3. Faça commit das alterações (`git commit -m 'feat: descrição da feature'`)
4. Faça push para a branch (`git push origin feature/minha-feature`)
5. Abra um Pull Request

### Diretrizes

- Siga os padrões de código existentes
- Use TypeScript com tipos explícitos
- Execute `npm run lint` antes de enviar seu PR
- Mantenha componentes pequenos e focados
- Use os hooks e stores existentes quando possível

---

## Licença

Este projeto é mantido pelo [Instituto ABCD](https://www.institutoabcd.org.br/).

Consulte o arquivo [LICENSE](LICENSE.md) para mais detalhes.

# Trabalho Prático 1 — Programação para a Web

- **Instituição:** Instituto Federal Sul-rio-grandense (IFSUL) - Campus Passo Fundo
- **Curso:** Bacharelado em Ciência da Computação
- **Disciplina:** Programação para a Web
- **Professora:** Jéssica Di Domênico
- **Aluno:** Daniel Cipriano da Silva

---

### Repositórios do Projeto

- **Aplicação Frontend (React / PWA):** [gerenciador-pesagens](https://github.com/danielc-silva/gerenciador-pesagens.git)
- **Backend / API (Node.js / Express / Drizzle ORM):** [api-gerenciador-pesagens](https://github.com/danielc-silva/api-gerenciador-pesagens.git)

---

# Gerenciador de Pesagens - Frontend (PWA / React)

Interface web responsiva e modular desenvolvida em **React** para o controle de manejo, alocação de bovinos e histórico de pesagens em fazendas. A aplicação consome a API desenvolvida em Node.js com PostgreSQL.

---

## Tecnologias Utilizadas

- **React**
- **React Router**
- **Bootstrap 5** & **React-Bootstrap**
- **Fetch API**
---

## Regras de Negócio e Funcionalidades

O sistema segue a hierarquia relacional e de dependência do domínio rural (1 para N):

1. **Gestão de Piquetes:** Cadastro, edição e remoção de áreas/pastagens da fazenda, definindo rótulo e capacidade máxima.
2. **Controle de Rebanho (Bovinos):** Cadastro e transferência de animais, vinculando cada bovino a um piquete cadastrado (`piquete_alocado` via FK).
3. **Registro de Pesagens:** Lançamento de pesagens periódicas vinculadas ao número do brinco do animal (`brinco_aferido` via FK), com controle de visualização pública para o operador de campo e painel com edição/exclusão na área restrita.

---

## Estrutura de Pastas e Componentes

```text
gerenciador-pesagens/
├── node_modules/
├── public/
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── BemVindo.jsx
│   ├── Bovinos.jsx
│   ├── Login.jsx
│   ├── MenuPrivado.jsx
│   ├── MenuPublico.jsx
│   ├── NotFound.jsx
│   ├── PesagensPrivado.jsx
│   ├── PesagensPublico.jsx
│   ├── Piquetes.jsx
│   ├── Sobre.jsx
│   ├── Usuario.jsx
│   └── withAuth.jsx
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── vercel.json

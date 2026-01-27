# 📚 Bookstore Fullstack

> Projeto de estudo para desenvolvimento Backend (Express) e Frontend (Next.js) com foco em TDD, Clean Architecture e DevOps (Docker).

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## 🚀 Quick Start

Este projeto utiliza **Docker Compose** para orquestrar o ambiente de desenvolvimento.

### Pré-requisitos

- Docker & Docker Desktop
- Node.js (opcional, para rodar comandos locais)

### Rode o Projeto

```bash
# Clone o repositório
git clone https://github.com/seu-user/bookstore-fullstack.git
cd bookstore-fullstack

# Inicie os containers
docker compose up -d
```

### Serviços Disponíveis

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3333](http://localhost:3333)
- **Postgres (Dev)**: `localhost:5432`
- **Postgres (Test)**: `localhost:5434`

---

## 📂 Estrutura do Projeto

O repositório é um **Monorepo** organizado da seguinte forma:

```text
bookstore-fullstack/
├── backend/    # API REST (Express + Prisma)
├── frontend/   # Web Application (Next.js + Tailwind)
├── docker-compose.yml          # Configuração de serviços de produção
└── docker-compose.override.yml # Overrides de desenvolvimento (Hot Reload, Debug)
```

Para mais detalhes técnicos, consulte os READMEs específicos:

- 🛠️ [Documentação do Backend](./backend/README.md)
- 🎨 [Documentação do Frontend](./frontend/README.md)

## 📝 Licença

Este projeto está sob a licença MIT.

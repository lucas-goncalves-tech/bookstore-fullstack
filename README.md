# 📚 Bookstore Fullstack

> Projeto de uma livraria online para estudo de desenvolvimento Backend (Express) e Frontend (Next.js) com foco em TDD, Clean Architecture e DevOps (Docker).

![CI](https://github.com/lucas-goncalves-tech/bookstore-fullstack/actions/workflows/main.yml/badge.svg)
[![codecov](https://codecov.io/github/lucas-goncalves-tech/bookstore-fullstack/graph/badge.svg?token=N6SFV9UZC7)](https://codecov.io/github/lucas-goncalves-tech/bookstore-fullstack)

## FrontEnd:

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Sonner](https://img.shields.io/badge/Sonner-000000?style=for-the-badge&logo=sonner&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide-000000?style=for-the-badge&logo=lucide&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-EC5990?style=for-the-badge&logo=react-hook-form&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3982CE?style=for-the-badge&logo=Zod&logoColor=white)
![Zustand](https://img.shields.io/badge/zustand-000000?style=for-the-badge&logo=zustand&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=tanstack-query&logoColor=white)
![Axios](https://img.shields.io/badge/axios-671DFE?style=for-the-badge&logo=axios&logoColor=white)

## BackEnd:

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Scalar](https://img.shields.io/badge/Scalar-000000?style=for-the-badge&logo=scalar&logoColor=white)
![OpenAPI](https://img.shields.io/badge/OpenAPI-6BA539?style=for-the-badge&logo=openapiinitiative&logoColor=white)
![Helmet](https://img.shields.io/badge/helmet-323330?style=for-the-badge&logo=helmet&logoColor=white)
![Cors](https://img.shields.io/badge/Cors-323330?style=for-the-badge&logo=cors&logoColor=white)
![Multer](https://img.shields.io/badge/Multer-323330?style=for-the-badge&logo=multer&logoColor=white)
![RateLimit](https://img.shields.io/badge/RateLimit-323330?style=for-the-badge&logo=ratelimit&logoColor=white)
![Tsyringe](https://img.shields.io/badge/tsyringe-323330?style=for-the-badge&logo=tsyringe&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtoken&logoColor=white)
![Bcrypt](https://img.shields.io/badge/bcrypt-2496ED?style=for-the-badge&logo=bcrypt&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3982CE?style=for-the-badge&logo=Zod&logoColor=white)
![Vitest](https://img.shields.io/badge/vitest-5C3AEA?style=for-the-badge&logo=vitest&logoColor=white)
![Supertest](https://img.shields.io/badge/supertest-323330?style=for-the-badge&logo=supertest&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

## DevOps:

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
git clone https://github.com/lucas-goncalves-tech/bookstore-fullstack.git
cd bookstore-fullstack

# Inicie os containers
docker compose up -d

# Sincronize o banco de dados (desenvolvimento)
docker compose exec api npx prisma migrate dev

# Para produção, use: docker compose exec api npx prisma migrate deploy
```

### Serviços Disponíveis

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3333/api/v1](http://localhost:3333/api/v1)
- **Scalar API Reference**: [http://localhost:3333/api-docs](http://localhost:3333/api-docs)
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
└── docker-compose.dev.yml # Overrides de desenvolvimento (Hot Reload, Debug)
```

Para mais detalhes técnicos, consulte os READMEs específicos:

- 🛠️ [Documentação do Backend](./backend/README.md)
- 🎨 [Documentação do Frontend](./frontend/README.md)

## 📝 Licença

Este projeto está sob a licença MIT.

# Home Page - BookStore

> [!IMPORTANT]
> Esta especificação define a página inicial (Home) da aplicação BookStore. Utilize os componentes Shadcn UI, siga o sistema de design definido em `globals.css` e mantenha todas as strings em Português (pt-BR).

---

## 🎨 Sistema de Design

### Paleta de Cores (Light Mode)

| Token                  | Valor HSL                  | Uso                          |
| ---------------------- | -------------------------- | ---------------------------- |
| `--background`         | `hsl(44 42.86% 93.14%)`    | Fundo principal              |
| `--foreground`         | `hsl(28.57 16.54% 24.90%)` | Texto principal              |
| `--card`               | `hsl(42 100% 98.04%)`      | Fundo dos cards              |
| `--card-foreground`    | `hsl(28.57 16.54% 24.90%)` | Texto dos cards              |
| `--primary`            | `hsl(30 33.87% 48.63%)`    | Cor primária (botões, links) |
| `--primary-foreground` | `hsl(0 0% 100%)`           | Texto sobre primário         |
| `--secondary`          | `hsl(40.65 34.83% 82.55%)` | Cor secundária               |
| `--muted`              | `hsl(39 34.48% 88.63%)`    | Elementos discretos          |
| `--muted-foreground`   | `hsl(32.31 18.48% 41.37%)` | Texto discreto               |
| `--accent`             | `hsl(42.86 32.81% 74.90%)` | Destaques                    |
| `--border`             | `hsl(40 31.43% 79.41%)`    | Bordas                       |
| `--destructive`        | `hsl(9.84 54.70% 45.88%)`  | Erros/Alertas                |

### Tipografia

| Token          | Fonte                    |
| -------------- | ------------------------ |
| `--font-sans`  | Libre Baskerville, serif |
| `--font-serif` | Lora, serif              |
| `--font-mono`  | IBM Plex Mono, monospace |

### Sombras e Raios

- **Border Radius:** `--radius: 0.25rem`
- **Sombras:** Utilizar variáveis `--shadow-sm`, `--shadow-md`, `--shadow-lg` conforme necessidade

---

## 📐 Estrutura da Página

```
┌─────────────────────────────────────────────────────────────────┐
│                           HEADER                                │
├─────────────────────────────────────────────────────────────────┤
│  Logo      │   Navegação Central    │    Ações do Usuário       │
│            │                        │                           │
└─────────────────────────────────────────────────────────────────┘
│                                                                 │
│                     BANNER (Hero Section)                       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     FILTROS                                │ │
│  │  [🔍 Buscar]  [Categoria ▼]  [R$ Min] - [R$ Max]           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │  Card    │  │  Card    │  │  Card    │  │  Card    │         │
│  │  Livro   │  │  Livro   │  │  Livro   │  │  Livro   │         │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘         │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │  Card    │  │  Card    │  │  Card    │  │  Card    │         │
│  │  Livro   │  │  Livro   │  │  Livro   │  │  Livro   │         │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘         │
│                                                                 │
│                      [Paginação]                                │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                           FOOTER                                │
│            © Todos os direitos reservados                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Componentes

### 1. Header

O header deve ser fixo no topo com blur de fundo (`backdrop-blur`) e conter três seções:

#### 1.1 Logo (Esquerda)

- **Criar uma logo** para "BookStore"
- Estilo: Elegante, com ícone de livro aberto
- Utilizar cor `primary` para destaque
- Link para `/` (home)

#### 1.2 Navegação Central

Menu de navegação horizontal com os seguintes links:

| Label    | Rota        |
| -------- | ----------- |
| Home     | `/`         |
| Livros   | `/livros`   |
| Autores  | `/autores`  |
| Editoras | `/editoras` |
| Contato  | `/contato`  |

- Estilo: Links com hover state usando `primary`
- Link ativo destacado com underline ou background `accent`

#### 1.3 Ações do Usuário (Direita)

**Estado não autenticado:**

- Botão "Entrar" (variant: `outline`, link: `/auth`)
- Botão "Cadastrar" (variant: `default`, link: `/auth/register`)

**Estado autenticado:**

- Avatar do usuário (imagem ou iniciais)
- Nome do usuário
- Dropdown menu com:
  - Meu Perfil
  - Meus Pedidos
  - Sair

---

### 2. Banner Hero

- Imagem de fundo com overlay gradiente escuro
- Altura: `60vh` ou `500px`
- Conteúdo centralizado:
  - Título: "Descubra seu próximo livro favorito"
  - Subtítulo: "Milhares de títulos esperando por você"
  - Call-to-action: Botão "Explorar Catálogo"
- Animação suave na entrada (fade-in + slide-up)

---

### 3. Seção de Filtros

Container com fundo `card` e `shadow-md`:

#### 3.1 Campo de Busca

```typescript
interface SearchProps {
  placeholder: "Buscar por título ou autor..."
  icon: Search (Lucide)
}
```

#### 3.2 Filtro de Categoria

- Componente: `Select` (Shadcn)
- Placeholder: "Todas as categorias"
- Opções carregadas da API

#### 3.3 Filtro de Preço

- Dois inputs numéricos: "Preço mínimo" e "Preço máximo"
- Prefixo "R$" nos inputs
- Validação: min <= max

---

### 4. Grid de Cards de Livros

Grid responsivo:

- Mobile: 1 coluna
- Tablet: 2 colunas
- Desktop: 3-4 colunas

#### Estrutura do Card

```typescript
interface BookCard {
  id: string;
  coverUrl: string | null; // Placeholder se null
  title: string;
  author: string;
  description: string; // Truncado em 2 linhas
  price: number; // Formatado: R$ 99,10
  stock: number; // Badge "Em estoque" ou "Esgotado"
}
```

**Elementos do Card:**

- Imagem da capa (aspect-ratio 2:3)
- Badge de estoque (canto superior direito)
- Título do livro (font-weight: bold)
- Nome do autor (cor `muted-foreground`)
- Descrição truncada
- Preço (destaque em `primary`)
- Botão "Ver Detalhes" ou "Adicionar ao Carrinho"
- Hover: elevar card com `shadow-lg` e scale sutil

---

### 5. Paginação

Utilizar componente de paginação com:

- Botões "Anterior" e "Próximo"
- Indicador de página atual: "Página 1 de 2"
- Total de itens: "15 livros encontrados"

---

### 6. Footer

- Fundo: `secondary`
- Texto centralizado: "© 2026 BookStore. Todos os direitos reservados."
- Links opcionais: Termos de Uso, Política de Privacidade

---

## 📦 API Response

### Endpoint: `GET /books`

```typescript
interface BooksResponse {
  data: Book[];
  metadata: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface Book {
  id: string;
  author: string;
  title: string;
  description: string;
  stock: number;
  coverUrl: string | null;
  categoryId: string | null;
  createdAt: string;
  deletedAt: string | null;
  price: number;
}
```

### Exemplo de Dados

```json
{
  "data": [
    {
      "id": "00e6412c-e9f4-4291-85de-5a8eed02cb71",
      "author": "J.K Rowling",
      "title": "Harry Potter",
      "description": "Ficção e ação com aventura em Hogwarts",
      "stock": 10,
      "coverUrl": null,
      "categoryId": null,
      "createdAt": "2026-01-31T22:27:54.696Z",
      "deletedAt": null,
      "price": 99.1
    }
  ],
  "metadata": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

---

## ✅ Requisitos Técnicos

1. **Data Fetching:** TanStack Query (React Query) para buscar livros
2. **Estado de Loading:** Skeleton cards enquanto carrega
3. **Estado Vazio:** Mensagem amigável "Nenhum livro encontrado"
4. **Tratamento de Erros:** Toast com mensagem de erro
5. **Responsividade:** Mobile-first approach
6. **Acessibilidade:** Labels em inputs, alt em imagens, navegação por teclado
7. **Performance:** Lazy loading de imagens, otimização de re-renders

---

## 🔗 Dependências de Componentes Shadcn

- `Button`
- `Input`
- `Select`
- `Card`
- `Avatar`
- `DropdownMenu`
- `Skeleton`
- `Badge`

---

## 📁 Estrutura de Arquivos Sugerida

```
src/
├── app/
│   └── page.tsx                    # Home page
├── components/
│   ├── layout/
│   │   ├── header.tsx              # Header component
│   │   └── footer.tsx              # Footer component
│   └── home/
│       ├── hero-banner.tsx         # Banner hero section
│       ├── book-filters.tsx        # Filtros de busca
│       ├── book-card.tsx           # Card individual do livro
│       ├── book-grid.tsx           # Grid de cards
│       └── pagination.tsx          # Componente de paginação
└── modules/
    └── books/
        ├── hooks/
        │   └── use-books.ts        # Hook para buscar livros
        ├── types/
        │   └── book.types.ts       # Interfaces TypeScript
        └── services/
            └── books.service.ts    # Chamadas API
```

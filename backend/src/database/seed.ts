import { PrismaClient } from "@prisma/client";
import { env } from "../core/config/env";
import bcrypt from "bcrypt";

const prisma_seed = new PrismaClient();
const books = [
  // Ficção Fantástica (R$45-85)
  { title: "Harry Potter e a Pedra Filosofal", author: "J.K. Rowling", description: "O início da jornada do jovem bruxo em Hogwarts", price: 49.90, stock: 15 },
  { title: "O Senhor dos Anéis: A Sociedade do Anel", author: "J.R.R. Tolkien", description: "A épica aventura pela Terra-média começa", price: 79.90, stock: 12 },
  { title: "As Crônicas de Nárnia", author: "C.S. Lewis", description: "Quatro crianças descobrem um mundo mágico através de um guarda-roupa", price: 59.90, stock: 20 },
  { title: "O Nome do Vento", author: "Patrick Rothfuss", description: "A lenda de Kvothe contada por ele mesmo", price: 84.90, stock: 8 },
  { title: "Mistborn: O Império Final", author: "Brandon Sanderson", description: "Uma ladra com poderes únicos desafia um império imortal", price: 69.90, stock: 10 },

  // Clássicos da Literatura (R$25-60)
  { title: "Dom Casmurro", author: "Machado de Assis", description: "O ciúme e a dúvida na obra-prima da literatura brasileira", price: 29.90, stock: 25 },
  { title: "1984", author: "George Orwell", description: "Distopia sobre vigilância e controle totalitário", price: 39.90, stock: 18 },
  { title: "Orgulho e Preconceito", author: "Jane Austen", description: "Romance e crítica social na Inglaterra do século XIX", price: 34.90, stock: 22 },
  { title: "Crime e Castigo", author: "Fiódor Dostoiévski", description: "A psicologia de um crime e suas consequências morais", price: 54.90, stock: 14 },
  { title: "Cem Anos de Solidão", author: "Gabriel García Márquez", description: "A saga da família Buendía em Macondo", price: 49.90, stock: 16 },

  // Desenvolvimento Pessoal (R$35-75)
  { title: "O Poder do Hábito", author: "Charles Duhigg", description: "Como os hábitos funcionam e como transformá-los", price: 44.90, stock: 30 },
  { title: "Mindset: A Nova Psicologia do Sucesso", author: "Carol S. Dweck", description: "Como a mentalidade define o sucesso", price: 49.90, stock: 28 },
  { title: "Pai Rico, Pai Pobre", author: "Robert Kiyosaki", description: "Educação financeira para alcançar a independência", price: 54.90, stock: 35 },
  { title: "Atomic Habits", author: "James Clear", description: "Pequenas mudanças, resultados extraordinários", price: 74.90, stock: 20 },
  { title: "A Coragem de Ser Imperfeito", author: "Brené Brown", description: "Como aceitar a vulnerabilidade transforma vidas", price: 39.90, stock: 24 },

  // Tecnologia e Programação (R$89-299)
  { title: "Clean Code", author: "Robert C. Martin", description: "Boas práticas para escrever código limpo e sustentável", price: 149.90, stock: 10 },
  { title: "O Programador Pragmático", author: "David Thomas & Andrew Hunt", description: "De aprendiz a mestre em desenvolvimento de software", price: 119.90, stock: 12 },
  { title: "Design Patterns", author: "Gang of Four", description: "Padrões de projeto orientado a objetos reutilizáveis", price: 189.90, stock: 8 },
  { title: "Estruturas de Dados e Algoritmos com JavaScript", author: "Loiane Groner", description: "Fundamentos de algoritmos para desenvolvedores web", price: 89.90, stock: 15 },
  { title: "System Design Interview", author: "Alex Xu", description: "Guia completo para entrevistas de design de sistemas", price: 299.90, stock: 6 },
];



async function main() {
  const adminEmail = env.ADMIN_EMAIL;
  const adminPassword = env.ADMIN_PASSWORD;
  const adminName = env.ADMIN_NAME;

  const hash = await bcrypt.hash(adminPassword, env.SALT);

  await prisma_seed.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash: hash,
      role: "ADMIN",
    },
  });

  //eslint-disable-next-line
  console.log(`Usuário Admin ${adminName} criado com sucesso!`);

  await Promise.all(
    books.map((book) =>
      prisma_seed.book.create({ data: book })
    )
  );
}

main()
  .catch((err) => {
    //eslint-disable-next-line
    console.error(err);
    process.exit(1);
  })
  .finally(async () => await prisma_seed.$disconnect());

import { RegisterForm } from "@/modules/register/components/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comece sua História | Bookstore",
  description: "Crie sua conta na Bookstore e comece sua jornada literária.",
};

export default function RegisterPage() {
  return (
    <div className="flex flex-1 w-full min-h-screen">
      {/* Left Side: Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#a77d52]/20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA--5wmjvJsG3qsNzSbOzAeboz6Zf7Gra69Y5H-t-T62vVZvDTTAmtu_JKelZHAiqEvdbQGuWnQm_t4GAZHfkVNxLfEYiLP1xwPGMffZHb7GYUC3iTmh0RAoWK85xlaZabgNR5AsnSIUeSiYoGLETaUlrtot04KqtUyRJuTAApTnZEbsUXso1UtAjHFyVY6TiOskVjVdrdt55oI4qQown0O9kCVSdfL4cT3dGzOaV_elY49CQQQzy0OXHI7vsBNdozHL7TEnoAbY-vK')",
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <blockquote className="font-serif text-3xl italic leading-snug mb-4">
            &quot;Um quarto sem livros é como um corpo sem alma.&quot;
          </blockquote>
          <cite className="font-sans font-medium text-lg opacity-90">
            — Marcus Tullius Cicero
          </cite>
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="flex flex-1 flex-col justify-center items-center px-6 py-12 lg:px-24 w-full lg:w-1/2 bg-[#ede9da] dark:bg-[#1c1916]">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-left space-y-2">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-[#4b3d33] dark:text-white tracking-tight">
              Comece sua História
            </h1>
            <p className="font-sans text-[#4b3d33]/80 dark:text-gray-400 text-lg">
              Junte-se a milhares de amantes de livros e organize sua biblioteca
              pessoal.
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
}

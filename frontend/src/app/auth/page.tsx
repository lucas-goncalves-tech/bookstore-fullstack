"use client";

import { LoginForm } from "@/modules/login/components/login-form";

export default function AuthPage() {
  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      {/* Left Side: Hero Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-background-dark">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCG__H1aQRbPeaSgisnUg7cMgt6ClPFMnmtu9oK15BnqTS6tlPBvN-CZa2J4PrAvcw9jdkB-DrFvsG18CmkXxvnfoNxfwBAqTB9gRD1Yh8MNKFLXWcI9ntXvIkKZDxjVWgYezj7iGl-ftlEyXyvGQ56oj7pGOSYocYd_v-vqEQuSJnA-B805lcSi7QBhbX5ubzZ2PFtK3UktVKp7ip1sNYpWsYDXCMU7iZ29DRan8h7e2JHkE6Lhi3t04wQC-pQ7HoVLEG0unKJ0zkl')",
          }}
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 h-full flex flex-col justify-end p-12 text-white">
          <blockquote className="text-3xl font-serif italic mb-4 leading-snug">
            &quot;Um quarto sem livros é como um corpo sem alma.&quot;
          </blockquote>
          <p className="font-sans font-medium text-lg opacity-90">
            — Marcus Tullius Cicero
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex flex-1 flex-col justify-center items-center p-6 sm:p-12 lg:p-24 bg-[#ede9da] dark:bg-[#1c1916] relative w-full lg:w-1/2">
        <div className="w-full max-w-md flex flex-col gap-8">
          {/* Header */}
          <div className="text-left space-y-2">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#4b3d33] dark:text-white tracking-tight font-serif">
              Bem-vindo de volta
            </h1>
            <p className="text-[#4b3d33]/80 dark:text-gray-400 font-sans text-lg">
              Por favor, insira seus dados para acessar sua biblioteca.
            </p>
          </div>

          {/* Form Component */}
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

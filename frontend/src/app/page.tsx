import { Header } from "@/components/header";
import { HomeMain } from "@/modules/home/components/main";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-serif">
      <Header />
      <HomeMain />
    </div>
  );
}

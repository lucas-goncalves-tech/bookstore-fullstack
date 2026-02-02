"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface BookDescriptionTabsProps {
  description: string;
  author: string;
}

type TabKey = "description" | "technical" | "author";

interface Tab {
  key: TabKey;
  label: string;
}

const tabs: Tab[] = [
  { key: "description", label: "Descrição" },
  { key: "technical", label: "Detalhes Técnicos" },
  { key: "author", label: "Sobre o Autor" },
];

export function BookDescriptionTabs({
  description,
  author,
}: BookDescriptionTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("description");

  return (
    <div className="">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav aria-label="Tabs" className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "border-b-2 px-1 py-4 text-base font-medium transition-colors",
                activeTab === tab.key
                  ? "border-primary font-bold text-foreground"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-primary"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl py-8 leading-relaxed text-muted-foreground">
        {activeTab === "description" && (
          <div className="space-y-4">
            {description.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}

        {activeTab === "technical" && (
          <div className="space-y-4">
            <p>
              Informações técnicas detalhadas sobre este livro estarão
              disponíveis em breve.
            </p>
          </div>
        )}

        {activeTab === "author" && (
          <div className="space-y-4">
            <p>
              <strong>{author}</strong> é o autor deste livro. Mais informações
              sobre o autor estarão disponíveis em breve.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

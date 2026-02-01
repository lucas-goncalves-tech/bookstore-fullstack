"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

interface BookCoverGalleryProps {
  coverUrl: string | null;
  title: string;
}

export function BookCoverGallery({ coverUrl, title }: BookCoverGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Por enquanto temos apenas uma imagem, mas preparado para múltiplas
  const images = coverUrl && !imageError ? [coverUrl] : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Imagem principal */}
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg bg-muted shadow-lg">
        {images.length > 0 ? (
          <Image
            src={images[selectedIndex]}
            alt={`Capa do livro: ${title}`}
            fill
            className="object-cover"
            priority
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-muted-foreground">
            <ImageIcon className="size-16" />
            <span className="text-sm">Imagem indisponível</span>
          </div>
        )}
      </div>

      {/* Thumbnails - só mostra se tiver mais de uma imagem */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative aspect-2/3 cursor-pointer overflow-hidden rounded-md border-2 transition-colors",
                selectedIndex === index
                  ? "border-primary"
                  : "border-transparent hover:border-primary/50"
              )}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

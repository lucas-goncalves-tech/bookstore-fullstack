import { AdminReview } from "../schemas/admin-review.schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import { Star } from "lucide-react";

interface AdminReviewDetailsDialogProps {
  review: AdminReview | null;
  onOpenChange: (open: boolean) => void;
}

export function AdminReviewDetailsDialog({ review, onOpenChange }: AdminReviewDetailsDialogProps) {
  if (!review) return null;

  return (
    <Dialog open={!!review} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalhes da Avaliação</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex items-start gap-4">
            {review.book.coverThumbUrl ? (
              <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-md border shadow-sm">
                <Image
                  src={review.book.coverThumbUrl}
                  alt={review.book.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            ) : (
              <div className="flex h-24 w-16 flex-shrink-0 items-center justify-center rounded-md border bg-muted shadow-sm">
                <span className="text-xs text-muted-foreground text-center px-1">Sem Capa</span>
              </div>
            )}
            <div className="space-y-1">
              <h4 className="font-semibold leading-none">{review.book.title}</h4>
              <p className="text-sm text-muted-foreground">{review.book.author}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-md border p-4 bg-muted/30">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase">Usuário</p>
              <p className="text-sm truncate w-full" title={review.user.name}>{review.user.name}</p>
              <p className="text-xs text-muted-foreground truncate w-full" title={review.user.email}>{review.user.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase">Data da Avaliação</p>
              <p className="text-sm">
                {format(new Date(review.createdAt), "dd 'de' MMM, yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Nota</p>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Comentário</p>
              <div className="rounded-md border p-3 bg-card min-h-[80px] max-h-[200px] overflow-y-auto">
                {review.comment ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{review.comment}</p>
                ) : (
                  <p className="text-sm italic text-muted-foreground">Avaliação sem texto.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}

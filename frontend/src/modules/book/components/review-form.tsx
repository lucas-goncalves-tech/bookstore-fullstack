import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateReviewSchema,
  createReviewSchema,
} from "../schemas/review.schema";
import { useCreateReview } from "../hooks/use-reviews";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

interface ReviewFormProps {
  bookId: string;
}

export function ReviewForm({ bookId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const { mutate, isPending } = useCreateReview(bookId);

  const form = useForm<CreateReviewSchema>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: CreateReviewSchema) => {
    if (data.rating === 0) {
      toast.error("Por favor, selecione uma nota.");
      return;
    }
    mutate(data, {
      onSuccess: () => {
        form.reset({
          rating: 0,
          comment: "",
        });
        setRating(0);
        setHoverRating(0);
      },
    });
  };

  return (
    <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm">
      <h4 className="mb-4 text-lg font-bold">Escreva sua avaliação</h4>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="focus:outline-hidden"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => {
                        setRating(star);
                        field.onChange(star);
                      }}
                    >
                      <Star
                        className={`size-6 transition-colors ${
                          star <= (hoverRating || rating)
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Conte o que você achou do livro..."
                    className="min-h-[100px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? "Enviando..." : "Enviar Avaliação"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateReviewSchema,
  createReviewSchema,
} from "../schemas/review.schema";
import { useCreateReview, useMyReview, useDeleteReview } from "../hooks/use-reviews";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
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
  
  const { data: myReview, isLoading: isLoadingReview } = useMyReview(bookId);
  const { mutate, isPending } = useCreateReview(bookId);
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteReview(bookId);

  const form = useForm<CreateReviewSchema>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (myReview) {
      form.reset({
        rating: myReview.rating,
        comment: myReview.comment,
      });
      setRating(myReview.rating);
    } else {
      form.reset({
        rating: 0,
        comment: "",
      });
      setRating(0);
    }
  }, [myReview, form]);

  const onSubmit = (data: CreateReviewSchema) => {
    if (data.rating === 0) {
      toast.error("Por favor, selecione uma nota.");
      return;
    }
    mutate(data);
  };

  const handleDelete = () => {
    deleteMutate();
  };

  if (isLoadingReview) {
    return (
      <div className="mb-8 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="h-32 animate-pulse bg-muted rounded-md" />
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-lg border border-border bg-card p-6 shadow-sm">
      <h4 className="mb-4 text-lg font-bold">
        {myReview ? "Sua avaliação" : "Escreva sua avaliação"}
      </h4>
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

          <div className="flex gap-4 items-center">
            <Button type="submit" disabled={isPending || isDeleting}>
              {isPending ? "Enviando..." : (myReview ? "Atualizar Avaliação" : "Enviar Avaliação")}
            </Button>
            
            {myReview && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete} 
                disabled={isPending || isDeleting}
              >
                <Trash2 className="size-4 mr-2" />
                {isDeleting ? "Excluindo..." : "Excluir Avaliação"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

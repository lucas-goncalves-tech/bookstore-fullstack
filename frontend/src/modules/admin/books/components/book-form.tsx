"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookFormValues, bookFormSchema } from "../schemas/book-form.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/modules/home/hooks/use-categories";
import { useCreateBook } from "../hooks/use-create-book";
import { useUpdateBook } from "../hooks/use-update-book";
import { Book } from "@/modules/home/schemas/book.schema";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface BookFormProps {
  initialData?: Book;
  onSuccess?: () => void;
}

export function BookForm({ initialData, onSuccess }: BookFormProps) {
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();

  const defaultValues: Partial<BookFormValues> = {
    title: initialData?.title || "",
    author: initialData?.author || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    categoryId: initialData?.categoryId || "",
  };

  const form = useForm<BookFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(bookFormSchema) as any,
    defaultValues,
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        author: initialData.author,
        description: initialData.description,
        price: Number(initialData.price),
        stock: initialData.stock,
        categoryId: initialData.categoryId || "",
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: BookFormValues) => {
    try {
      if (initialData) {
        await updateBook.mutateAsync({ id: initialData.id, data });
      } else {
        await createBook.mutateAsync(data);
      }
      onSuccess?.();
    } catch (error) {
      console.error(error);
    }
  };

  const isLoading = createBook.isPending || updateBook.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título do livro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Autor</FormLabel>
              <FormControl>
                <Input placeholder="Nome do autor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descrição do livro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estoque</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoadingCategories}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { value, onChange, ...rest } = field;
            return (
              <FormItem>
                <FormLabel>Capa do Livro</FormLabel>
                <FormControl>
                  <Input
                    {...rest}
                    value={undefined}
                    onChange={(event) => {
                      onChange(event.target.files);
                    }}
                    type="file"
                    accept="image/*"
                  />
                </FormControl>
                {initialData?.coverUrl && (
                  <FormDescription>
                    Deixe vazio para manter a imagem atual.
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

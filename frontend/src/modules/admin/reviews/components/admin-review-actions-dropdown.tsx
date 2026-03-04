import { AdminReview } from "../schemas/admin-review.schema";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Ban, ShieldAlert } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteAdminReview } from "../hooks/use-delete-admin-review";
import { useBanUser } from "../../users/hooks/use-ban-user";
import { usePermanentDeleteUser } from "../../users/hooks/use-permanent-delete-user";

interface AdminReviewActionsDropdownProps {
  review: AdminReview;
}

type ModalType = "delete-review" | "ban-user" | "delete-user" | null;

export function AdminReviewActionsDropdown({ review }: AdminReviewActionsDropdownProps) {
  const [modalType, setModalType] = useState<ModalType>(null);

  const deleteReview = useDeleteAdminReview();
  const banUser = useBanUser();
  const permanentDeleteUser = usePermanentDeleteUser();

  const handleAction = async () => {
    try {
      if (modalType === "delete-review") {
        await deleteReview.mutateAsync(review.id);
      } else if (modalType === "ban-user") {
        await banUser.mutateAsync({
          id: review.user.id,
          data: { banReason: "Violação dos termos em uma avaliação" },
        });
      } else if (modalType === "delete-user") {
        await permanentDeleteUser.mutateAsync(review.user.id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setModalType(null);
    }
  };

  const isPending =
    deleteReview.isPending || banUser.isPending || permanentDeleteUser.isPending;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setModalType("delete-review")} className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" /> Deletar Avaliação
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setModalType("ban-user")}>
            <Ban className="mr-2 h-4 w-4" /> Banir Usuário
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setModalType("delete-user")} className="text-destructive focus:text-destructive">
            <ShieldAlert className="mr-2 h-4 w-4" /> Deletar Usuário Permanentemente
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={modalType !== null} onOpenChange={(open) => !open && setModalType(null)}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {modalType === "delete-review" && "Deletar Avaliação?"}
              {modalType === "ban-user" && "Banir Usuário?"}
              {modalType === "delete-user" && "Deletar Usuário Permanentemente?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {modalType === "delete-review" &&
                "Esta ação é irreversível. A avaliação será removida definitivamente do sistema."}
              {modalType === "ban-user" &&
                `Tem certeza que deseja banir o usuário "${review.user.name}"? Ele perderá o acesso ao sistema.`}
              {modalType === "delete-user" &&
                `Esta ação não pode ser desfeita. O usuário "${review.user.name}" e todos os seus dados serão apagados definitivamente do banco de dados.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className={
                modalType === "delete-review" || modalType === "delete-user"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
              onClick={async (e) => {
                e.preventDefault();
                await handleAction();
              }}
              disabled={isPending}
            >
              {isPending ? "Processando..." : "Confirmar Ação"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { UsersTable } from "./users-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserForm } from "./user-form";
import { UserPasswordForm } from "./user-password-form";
import { UserBanForm } from "./user-ban-form";
import { AdminUser, AdminUsersResponse } from "../schemas/admin-user.schema";
import { AdminUserFilter } from "./admin-user-filter";

interface AdminUsersClientProps {
  initialData?: AdminUsersResponse | null;
}

type ModalType = "edit" | "password" | "ban" | "create" | null;

export function AdminUsersClient({ initialData }: AdminUsersClientProps) {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | undefined>(
    undefined
  );

  const handleEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setModalType("edit");
  };

  const handleChangePassword = (user: AdminUser) => {
    setSelectedUser(user);
    setModalType("password");
  };

  const handleBan = (user: AdminUser) => {
    setSelectedUser(user);
    setModalType("ban");
  };

  const handleCreate = () => {
    setSelectedUser(undefined);
    setModalType("create");
  };

  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      setModalType(null);
      setSelectedUser(undefined);
    }
  };

  const handleSuccess = () => {
    setModalType(null);
    setSelectedUser(undefined);
  };

  const getSheetTitle = () => {
    switch (modalType) {
      case "create":
        return "Novo Usuário";
      case "edit":
        return "Editar Usuário";
      case "password":
        return "Trocar Senha";
      case "ban":
        return "Banir Usuário";
      default:
        return "";
    }
  };

  const getSheetDescription = () => {
    switch (modalType) {
      case "create":
        return "Preencha os detalhes para adicionar um novo usuário ou administrador.";
      case "edit":
        return "Faça alterações nos detalhes do usuário abaixo.";
      case "password":
        return "Defina uma nova senha para este usuário.";
      case "ban":
        return "Bane o usuário do sistema, impedindo seu login.";
      default:
        return "";
    }
  };

  const actionButton = (
    <Button onClick={handleCreate} size="sm" className="h-9 w-full sm:w-auto">
      <Plus className="mr-2 h-4 w-4" />
      Novo Usuário
    </Button>
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight px-1">Gerenciar Usuários</h1>

      <div className="bg-card rounded-md border border-border shadow-sm px-4">
        <AdminUserFilter actionButton={actionButton} />
      </div>

      <UsersTable
        onEdit={handleEdit}
        onChangePassword={handleChangePassword}
        onBan={handleBan}
        initialData={initialData}
      />

      <Sheet open={modalType !== null} onOpenChange={handleModalOpenChange}>
        <SheetContent className="overflow-y-auto sm:max-w-md w-full">
          <SheetHeader>
            <SheetTitle>{getSheetTitle()}</SheetTitle>
            <SheetDescription>{getSheetDescription()}</SheetDescription>
          </SheetHeader>
          <div className="py-4">
            {(modalType === "create" || modalType === "edit") && (
              <UserForm initialData={selectedUser} onSuccess={handleSuccess} />
            )}
            {modalType === "password" && selectedUser && (
              <UserPasswordForm user={selectedUser} onSuccess={handleSuccess} />
            )}
            {modalType === "ban" && selectedUser && (
              <UserBanForm user={selectedUser} onSuccess={handleSuccess} />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

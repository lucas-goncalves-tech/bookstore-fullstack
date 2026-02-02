"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import React from "react"

const routeMap: Record<string, string> = {
    "admin": "Dashboard",
    "books": "Livros",
    "categories": "Categorias",
    "users": "Usuários",
    "create": "Criar",
    "edit": "Editar"
}

export function AdminHeader() {
    const pathname = usePathname()
    const paths = pathname.split('/').filter(Boolean)

  return (
    <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:justify-between">
       <Breadcrumb>
        <BreadcrumbList>
        {paths.map((path, index) => {
            const isLast = index === paths.length - 1
            const href = `/${paths.slice(0, index + 1).join('/')}`
            const title = routeMap[path] || path

            return (
                <React.Fragment key={path}>
                    <BreadcrumbItem>
                        {isLast ? (
                             <BreadcrumbPage>{title}</BreadcrumbPage>
                        ) : (
                            <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
                        )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
            )
        })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

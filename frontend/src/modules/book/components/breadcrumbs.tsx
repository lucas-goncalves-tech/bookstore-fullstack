"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BookBreadcrumbsProps {
  bookTitle: string;
  categoryName?: string | null;
  categoryId?: string | null;
}

export function BookBreadcrumbs({
  bookTitle,
  categoryName,
  categoryId,
}: BookBreadcrumbsProps) {
  return (
    <Breadcrumb className="mb-8 overflow-x-auto whitespace-nowrap pb-2">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator>
          <ChevronRight className="size-4 text-muted-foreground" />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              Livros
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {categoryName && (
          <>
            <BreadcrumbSeparator>
              <ChevronRight className="size-4 text-muted-foreground" />
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={categoryId ? `/?categoryId=${categoryId}` : "/"}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {categoryName}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}

        <BreadcrumbSeparator>
          <ChevronRight className="size-4 text-muted-foreground" />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage className="font-medium text-foreground">
            {bookTitle}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

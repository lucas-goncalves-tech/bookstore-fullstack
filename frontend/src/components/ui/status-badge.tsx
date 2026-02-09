import { cn } from "@/lib/utils";
import { Badge } from "./badge";

export function StatusBadge({ status }: { status: "CONFIRMED" | "PENDING" }) {
  return (
    <Badge
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold",
        status === "CONFIRMED"
          ? "bg-green-200 text-green-800 border border-green-600"
          : "bg-yellow-200 text-yellow-800 border border-yellow-600",
      )}
    >
      {status === "CONFIRMED" ? "Concluído" : status}
    </Badge>
  );
}

// components/dashboard/clients/ClientsColumns.tsx
"use client";

import * as React from "react";
import { MoreVertical, Paperclip, Pencil, Trash2, Download } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { ClientData } from "@/types/client.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

interface GetClientColumnsProps {
  onEdit?: (client: ClientData) => void;
  onDelete?: (client: ClientData) => void;
}

/** Pulls a readable file name out of a storage URL, decoding %xx escapes. */
function getFileNameFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname;
    const last = path.substring(path.lastIndexOf("/") + 1);
    return decodeURIComponent(last) || "attachment";
  } catch {
    return "attachment";
  }
}

/** Triggers a browser download for a given URL without navigating away. */
function downloadAttachment(url: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = getFileNameFromUrl(url);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getClientColumns({
  onEdit,
  onDelete,
}: GetClientColumnsProps = {}): ColumnDef<ClientData>[] {
  return [
    {
      accessorKey: "name",
      header: "اسم العميل",
      cell: ({ row }) => (
        <span className="flex items-center gap-2">
          <Checkbox />
          {row.getValue("name")}
        </span>
      )
    },
    {
      accessorKey: "clientType",
      header: "نوع العميل",
      cell: ({ row }) => (row.original.clientType === "individual" ? "فردي" : "تجاري"),
    },
    {
      accessorKey: "mobile",
      header: "رقم الجوال",
    },
    {
      accessorKey: "email",
      header: "البريد الإلكتروني",
    },
    {
      accessorKey: "city",
      header: "المدينة",
    },
    {
      accessorKey: "country",
      header: "الدولة",
    },
    {
      accessorKey: "currency",
      header: "العملة",
    },
    {
      id: "attachments",
      header: "المرفقات",
      cell: ({ row }) => {
        const attachments = row.original.attachments ?? [];

        if (attachments.length === 0) {
          return (
            <div className="flex items-center  gap-1 text-muted-foreground">
              <span>0</span>
              <Paperclip className="h-4 w-4" />
            </div>
          );
        }

        // Single attachment: download directly on click, no menu needed.
        if (attachments.length === 1) {
          return (
            <button
              type="button"
              onClick={() => downloadAttachment(attachments[0])}
              className="flex items-center gap-1 text-[#463baf] hover:underline"
            >
              <span>{attachments.length}</span>
              <Paperclip className="h-4 w-4" />
            </button>
          );
        }

        // Multiple attachments: list each one so the user picks which to download.
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-[#0088FF] hover:underline">
              <span>{attachments.length}</span>
              <Paperclip className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {attachments.map((url, index) => (
                <DropdownMenuItem
                  key={url}
                  onClick={() => downloadAttachment(url)}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span className="truncate max-w-[220px]">
                    {getFileNameFromUrl(url) || `ملف ${index + 1}`}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="text-muted-foreground">
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onEdit?.(row.original)}
            >
              <Pencil className="h-4 w-4" />
              تعديل
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete?.(row.original)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              حذف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
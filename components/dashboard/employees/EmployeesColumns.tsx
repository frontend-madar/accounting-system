"use client";

import * as React from "react";
import { MoreVertical, Paperclip } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Employee } from "@/types/types";
import { Checkbox } from "@/components/ui/checkbox";

export function getEmployeeColumns(): ColumnDef<Employee>[] {
  return [
    {
      accessorKey: "employeeNumber",
      header: "الرقم الوظيفي",
    },
    {
      accessorKey: "name",
      header: "اسم الموظف",
    },
    {
      accessorKey: "department",
      header: "القسم",
    },
    {
      accessorKey: "jobTitle",
      header: "المسمى الوظيفي",
    },
    {
      accessorKey: "hireDate",
      header: "تاريخ التعيين",
    },
    {
      accessorKey: "salary",
      header: "الراتب",
      cell: ({ row }) => (
        <span className="font-medium">
          <span className="text-muted-foreground text-[13px] ml-1">EGP</span>
          {row.original.salary.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "attachmentsCount",
      header: "المرفقات",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <span>{row.original.attachmentsCount}</span>
          <Paperclip className="h-4 w-4 text-muted-foreground" />
        </div>
      ),
    },
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
    },
    {
      id: "actions",
      header: "",
      cell: () => (
        <button type="button" className="text-muted-foreground">
          <MoreVertical className="h-4 w-4" />
        </button>
      ),
    },
  ];
}
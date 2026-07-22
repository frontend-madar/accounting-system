

"use client";

import * as React from "react";
import { MoreVertical, Paperclip, Pencil, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { EmployeeData } from "@/types/employee.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Checkbox } from "@/components/ui/checkbox";
interface GetEmployeeColumnsProps {
  onEdit?: (employee: EmployeeData) => void;
  onDelete?: (employee: EmployeeData) => void;
}


export function getEmployeeColumns({
  onEdit,
  onDelete,
}: GetEmployeeColumnsProps = {}): ColumnDef<EmployeeData>[] {
  return [
    {
      accessorKey: "employeeNumber",
      header: "الرقم الوظيفي",
      cell: ({ row }) => (
        <span className="flex items-center gap-2">
          <Checkbox />
          {/* {row.original.id} */}
        </span>
      )
    },
    {
      accessorKey: "fullName",
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
      cell: ({ row }) => new Date(row.original.hireDate).toLocaleDateString("ar-EG"),
    },
    {
      accessorKey: "basicSalary",
      header: "الراتب",
      cell: ({ row }) => (
        <span className="font-medium">
          <span className="text-muted-foreground text-[13px] ml-1">EGP</span>
          {Number(row.original.basicSalary).toLocaleString()}
        </span>
      ),
    },
    {
      id: "attachments",
      header: "المرفقات",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <span>{row.original.attachments.length}</span>
          <Paperclip className="h-4 w-4 text-muted-foreground" />
        </div>
      ),
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
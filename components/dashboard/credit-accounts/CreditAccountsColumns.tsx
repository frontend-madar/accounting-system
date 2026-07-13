"use client";

import * as React from "react";
import { MoreVertical } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import {
  CreditAccountStatus,
  CreditAccountStatusBadge,
} from "./CreditAccountStatusBadge";

export interface CreditAccount {
  id: string;
  employee: string;
  employeeCode: string;
  client: string;
  amount: number;
  travelDate: string;
  paid: number;
  paymentMethod: string;
  paymentDate: string;
  remaining: number;
  status: CreditAccountStatus;
}

interface GetCreditAccountColumnsArgs {
  onStatusChange: (id: string, status: CreditAccountStatus) => void;
}

export function getCreditAccountColumns({
  onStatusChange,
}: GetCreditAccountColumnsArgs): ColumnDef<CreditAccount>[] {
  return [
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
      accessorKey: "employee",
      header: "الموظف",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-[#232323]">{row.original.employee}</span>
          <span className="text-muted-foreground text-[13px]">
            {row.original.employeeCode}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "client",
      header: "العميل",
    },
    {
      accessorKey: "amount",
      header: "المبلغ",
    },
    {
      accessorKey: "travelDate",
      header: "تاريخ السفر",
    },
    {
      accessorKey: "paid",
      header: "المدفوع",
    },
    {
      accessorKey: "paymentMethod",
      header: "طريقة الدفع",
    },
    {
      accessorKey: "paymentDate",
      header: "تاريخ الدفع",
    },
    {
      accessorKey: "remaining",
      header: "المتبقي",
    },
    {
      accessorKey: "status",
      header: "الحالة",
      cell: ({ row }) => (
        <CreditAccountStatusBadge
          status={row.original.status}
          onChange={(status) => onStatusChange(row.original.id, status)}
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
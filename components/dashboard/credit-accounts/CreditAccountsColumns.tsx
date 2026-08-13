"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { TableRowActions } from "../shared/TableRowActions";
import {
  CreditAccountStatus,
  CreditAccountStatusBadge,
} from "./CreditAccountStatusBadge";

export interface CreditAccount {
  id: string;
  employee?: string;
  employeeName?: string;
  employeeCode?: string;
  client?: string;
  clientName?: string;
  amount?: number;
  totalAmount?: number;
  travelDate: string;
  paid?: number;
  paymentMethod?: string;
  paymentDate?: string;
  remaining?: number;
  remainingAmount?: number;
  currency?: string;
  status: CreditAccountStatus;
  payments?: Array<{
    id?: string;
    amount?: number;
    paymentMethod?: string;
    paymentDate?: string;
  }>;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "-";
  if (dateStr.includes("T")) {
    return dateStr.split("T")[0];
  }
  return dateStr;
}

interface GetCreditAccountColumnsArgs {
  onStatusChange?: (id: string, status: CreditAccountStatus) => void;
  onEdit?: (id: string) => void;
  onDelete?: (account: CreditAccount) => void;
}

export function getCreditAccountColumns({
  onStatusChange,
  onEdit,
  onDelete,
}: GetCreditAccountColumnsArgs = {}): ColumnDef<any>[] {
  return [
    {
      accessorKey: "employee",
      header: "الموظف",
      cell: ({ row }) => {
        const empName = row.original.employeeName || row.original.employee || "-";
        const empCode = row.original.employeeCode || "";
        return (
          <div className="flex items-center gap-2">
            <span className="text-[#232323]">{empName}</span>
            {empCode ? (
              <span className="text-muted-foreground text-[13px]">
                {empCode}
              </span>
            ) : null}
          </div>
        );
      },
    },
    {
      accessorKey: "client",
      header: "العميل",
      cell: ({ row }) => row.original.clientName || row.original.client || "-",
    },
    {
      accessorKey: "amount",
      header: "المبلغ",
      cell: ({ row }) => {
        const total = row.original.totalAmount ?? row.original.amount ?? 0;
        const curr = row.original.currency ? ` ${row.original.currency}` : "";
        return `${total.toLocaleString()}${curr}`;
      },
    },
    {
      accessorKey: "travelDate",
      header: "تاريخ السفر",
      cell: ({ row }) => formatDate(row.original.travelDate),
    },
    {
      accessorKey: "paid",
      header: "المدفوع",
      cell: ({ row }) => {
        if (row.original.paid !== undefined) {
          return row.original.paid.toLocaleString();
        }
        const total = row.original.totalAmount ?? row.original.amount ?? 0;
        const remaining = row.original.remainingAmount ?? row.original.remaining ?? 0;
        const paid = total - remaining;
        return paid.toLocaleString();
      },
    },
    {
      accessorKey: "paymentMethod",
      header: "طريقة الدفع",
      cell: ({ row }) => {
        const method =
          row.original.payments?.[0]?.paymentMethod ||
          row.original.paymentMethod ||
          "-";
        return method;
      },
    },
    {
      accessorKey: "paymentDate",
      header: "تاريخ الدفع",
      cell: ({ row }) => {
        const pDate =
          row.original.payments?.[0]?.paymentDate || row.original.paymentDate;
        return formatDate(pDate);
      },
    },
    {
      accessorKey: "remaining",
      header: "المتبقي",
      cell: ({ row }) => {
        const remaining =
          row.original.remainingAmount ?? row.original.remaining ?? 0;
        const curr = row.original.currency ? ` ${row.original.currency}` : "";
        return `${remaining.toLocaleString()}${curr}`;
      },
    },
    {
      accessorKey: "status",
      header: "الحالة",
      cell: ({ row }) => (
        <CreditAccountStatusBadge
          status={row.original.status}
          onChange={
            onStatusChange
              ? (status) => onStatusChange(row.original.id, status)
              : undefined
          }
        />
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <TableRowActions
          row={row.original}
          onEdit={onEdit ? () => onEdit(row.original.id) : undefined}
          onDelete={onDelete}
        />
      ),
    },
  ];
}
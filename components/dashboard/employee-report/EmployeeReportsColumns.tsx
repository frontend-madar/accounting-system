"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { EmployeeReport } from "@/types/employee-report.types";
import { TableRowActions } from "../shared/TableRowActions";

function formatDate(iso: string): string {
  return iso ? new Date(iso).toLocaleDateString("ar-EG") : "-";
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString() + " ر.س";
}

const ORIGIN_STYLES: Record<string, string> = {
  MANUAL: "bg-[#E8EEFD] text-[#3D6BEA]",
  AUTO: "bg-[#E6F6F4] text-[#1BA915]",
};

function OriginBadge({ origin }: { origin: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-medium ${
        ORIGIN_STYLES[origin] ?? "bg-[#F1F1F3] text-[#5C5F63]"
      }`}
    >
      {origin === "MANUAL" ? "يدوي" : "تلقائي"}
    </span>
  );
}

interface GetEmployeeReportColumnsProps {
  onEdit?: (report: EmployeeReport) => void;
  onDelete?: (report: EmployeeReport) => void;
}

export function getEmployeeReportColumns({
  onEdit,
  onDelete,
}: GetEmployeeReportColumnsProps = {}): ColumnDef<EmployeeReport>[] {
  return [
    {
      accessorKey: "employeeName",
      header: "اسم الموظف",
      cell: ({ row }) => (
        <span className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EEEBFB] text-[#101011] text-xs font-medium">
            {row.original.employeeName?.charAt(0).toUpperCase()}
          </span>
          {row.original.employeeName}
        </span>
      ),
    },
    {
      accessorKey: "clientName",
      header: "اسم العميل",
    },
    {
      accessorKey: "target",
      header: "التارجت",
      cell: ({ row }) => formatCurrency(row.original.target),
    },
    {
      accessorKey: "paymentDate",
      header: "تاريخ الدفع",
      cell: ({ row }) => formatDate(row.original.paymentDate),
    },
    {
      accessorKey: "origin",
      header: "المصدر",
      cell: ({ row }) => <OriginBadge origin={row.original.origin} />,
    },
    {
      accessorKey: "manuallyOverridden",
      header: "تعديل يدوي",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-medium ${
            row.original.manuallyOverridden
              ? "bg-[#FCEADF] text-[#E0673A]"
              : "bg-[#E6F6F4] text-[#1BA915]"
          }`}
        >
          {row.original.manuallyOverridden ? "نعم" : "لا"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "تاريخ الإنشاء",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <TableRowActions
          row={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];
}
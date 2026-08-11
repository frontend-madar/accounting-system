"use client";

import * as React from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PayrollStatusBadge } from "./Payrollstatusbadge";
import { useUpdatePayrollRunStatus } from "@/hooks/use-payroll";
import type { PayrollRunStatus } from "@/types/payroll.types";

const STATUS_OPTIONS: PayrollRunStatus[] = ["مسودة", "معتمدة", "كانسل"];

interface PayrollStatusDropdownProps {
  payrollId: string;
  status: PayrollRunStatus;
}

export function PayrollStatusDropdown({ payrollId, status }: PayrollStatusDropdownProps) {
  const { mutate: updateStatus, isPending } = useUpdatePayrollRunStatus();

  if (isPending) {
    return (
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span className="text-[13px]">جاري التحديث...</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 outline-none">
        <PayrollStatusBadge value={status} />
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {STATUS_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => {
              if (option === status) return;
              updateStatus({ id: payrollId, payload: { status: option } });
            }}
            className="flex items-center justify-between gap-2"
          >
            <PayrollStatusBadge value={option} />
            {option === status && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
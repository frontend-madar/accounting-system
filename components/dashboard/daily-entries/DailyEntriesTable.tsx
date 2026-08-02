"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { DailyEntryItem } from "@/types/daily-entry.types";
import { Checkbox } from "../../ui/checkbox";
import EmptyState from "../shared/EmptyState";
import { TableRowActions } from "../shared/TableRowActions";
import { NewDailyEntryRow } from "./NewDailyEntryRow";

const COLUMNS = [
  "رقم العميل",
  "الموظف",
  "العميل",
  "check in",
  "Check out",
  "الوجهة",
  "مكان الحجز",
  "نوع الحجز",
  "سعر الحجز",
  "اجمالي التكلفة",
  "المبلغ المسدد",
  "تاريخ الدفع",
  "وسيلة الدفع",
  "المبلغ المتبقي",
  "",
];

const ENTRY_CELL_CLASS =
  "align-middle text-center text-[18px] text-[#232323]";

const BOOKING_CELL_CLASS =
  "align-middle text-center text-[18px] text-[#232323] bg-[#FAFAFB] border-x border-[#EDEDF2]";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "-";
  return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
}

function CurrencyText({
  amount,
  currency,
}: {
  amount: number;
  currency?: string;
}) {
  return (
    <span className="font-medium tabular-nums">
      <span className="ml-1 text-[15px] font-normal text-muted-foreground">
        {currency || "EGP"}
      </span>
      {amount.toLocaleString()}
    </span>
  );
}

function RemainingBadge({
  amount,
  currency,
}: {
  amount: number;
  currency?: string;
}) {
  const isSettled = amount <= 0;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[13px] font-medium tabular-nums ${isSettled
          ? "bg-[#E7F6EC] text-[#1E9E4C]"
          : "bg-[#FDEDEA] text-[#E0472C]"
        }`}
    >
      <span className="text-[11px] font-normal opacity-80">
        {currency || "EGP"}
      </span>
      {amount.toLocaleString()}
    </span>
  );
}

function BookingTypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#EFEBFB] px-3 py-1 text-[13px] font-medium text-[#463BAF]">
      {type}
    </span>
  );
}

function DailyEntriesTableSkeleton() {
  const skeletonRows = Array.from({ length: 6 });

  return (
    <div className="overflow-hidden rounded-2xl bg-white ctm-shadow">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="[&_tr]:border-b-0">
            <TableRow className="sticky top-0 z-10 hover:bg-[#F5F6F7] bg-[#F5F6F7] border-none">
              <TableHead className="w-10" />
              {COLUMNS.map((col, i) => (
                <TableHead
                  key={col || `col-${i}`}
                  className="whitespace-nowrap py-3 text-[18px] text-[#101011]"
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {skeletonRows.map((_, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={`border-b border-[#EDEDF2] ${rowIndex % 2 === 0 ? "bg-white" : "bg-[#FCFCFD]"
                  }`}
              >
                <TableCell className="text-center">
                  <Skeleton className="mx-auto h-4 w-4 rounded" />
                </TableCell>
                {COLUMNS.map((col, i) => (
                  <TableCell key={col || `col-${i}`} className="text-center">
                    <Skeleton className="mx-auto h-4 w-16 rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

interface DailyEntriesTableProps {
  data: DailyEntryItem[];
  isLoading?: boolean;
  addButtonLabel?: string;
  onEdit?: (entry: DailyEntryItem) => void;
  onDelete?: (entry: DailyEntryItem) => void;
  isAddingNew?: boolean;
  onCancelAdd?: () => void;
  onCreated?: () => void;
}

export function DailyEntriesTable({
   data,
  isLoading,
  addButtonLabel = "إضافة قيد جديد",
  onEdit,
  onDelete,
  isAddingNew,
  onCancelAdd,
  onCreated,
}: DailyEntriesTableProps) {
  if (isLoading) {
    return <DailyEntriesTableSkeleton />;
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title="لا يوجد قيود يومية حتى الآن"
        description="إضافة قيد يومي جديد لتسجيل حجوزات العميل ومتابعة مدفوعاته."
        buttonText={addButtonLabel}
        href="/dashboard/daily-entries/create"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white ctm-shadow">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="[&_tr]:border-b-0">
            <TableRow className="sticky top-0 z-10 hover:bg-[#F5F6F7] bg-[#F5F6F7] border-none">
              <TableHead className="w-10" />
              {COLUMNS.map((col, i) => (
                <TableHead
                  key={col || `col-${i}`}
                  className="whitespace-nowrap py-3 text-[18px] text-[#101011]"
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isAddingNew && onCancelAdd && onCreated && (
              <NewDailyEntryRow onCancel={onCancelAdd} onCreated={onCreated} />
            )}
            {data.map((entry, entryIndex) => {
              const rowSpan = entry.bookingLines.length || 1;
              const groupClass =
                entryIndex % 2 === 0 ? "bg-white" : "bg-[#FCFCFD]";

              if (entry.bookingLines.length === 0) {
                return (
                  <TableRow
                    key={entry.id}
                    className={`border-b border-[#EDEDF2] transition-colors hover:bg-[#F7F6FD] ${groupClass}`}
                  >
                    <TableCell className="align-middle text-center">
                      <Checkbox />
                    </TableCell>
                    <TableCell className={`${ENTRY_CELL_CLASS} font-medium`}>
                      {entry.clientNumber}
                    </TableCell>
                    <TableCell className={ENTRY_CELL_CLASS}>
                      {entry.employeeName}
                    </TableCell>
                    <TableCell className={ENTRY_CELL_CLASS}>
                      {entry.clientName}
                    </TableCell>
                    <TableCell className={`${ENTRY_CELL_CLASS} text-[#101011]`}>
                      {formatDate(entry.checkIn)}
                    </TableCell>
                    <TableCell className={`${ENTRY_CELL_CLASS} text-[#101011]`}>
                      {formatDate(entry.checkOut)}
                    </TableCell>
                    <TableCell className={ENTRY_CELL_CLASS}>
                      {entry.destination}
                    </TableCell>
                    <TableCell colSpan={3} className={BOOKING_CELL_CLASS}>
                      -
                    </TableCell>
                    <TableCell className={ENTRY_CELL_CLASS}>
                      <CurrencyText amount={entry.totalCost} currency={entry.currency} />
                    </TableCell>
                    <TableCell className={ENTRY_CELL_CLASS}>
                      <CurrencyText amount={entry.paidAmount} currency={entry.currency} />
                    </TableCell>
                    <TableCell className={`${ENTRY_CELL_CLASS} text-[#101011]`}>
                      {formatDate(entry.paymentDate)}
                    </TableCell>
                    <TableCell className={ENTRY_CELL_CLASS}>
                      {entry.paymentMethod}
                    </TableCell>
                    <TableCell className="align-middle text-center">
                      <RemainingBadge amount={entry.remainingAmount} currency={entry.currency} />
                    </TableCell>
                    <TableCell className="align-middle text-center">
                      <TableRowActions row={entry} onEdit={onEdit} onDelete={onDelete} />
                    </TableCell>
                  </TableRow>
                );
              }

              return entry.bookingLines.map((booking, index) => (
                <TableRow
                  key={booking.id}
                  className={`border-b border-[#EDEDF2] transition-colors hover:bg-[#F7F6FD] ${groupClass}`}
                >
                  {index === 0 && (
                    <TableCell
                      rowSpan={rowSpan}
                      className="align-middle text-center"
                    >
                      <Checkbox />
                    </TableCell>
                  )}

                  {index === 0 && (
                    <>
                      <TableCell rowSpan={rowSpan} className={`${ENTRY_CELL_CLASS} font-medium`}>
                        {entry.clientNumber}
                      </TableCell>
                      <TableCell rowSpan={rowSpan} className={ENTRY_CELL_CLASS}>
                        {entry.employeeName}
                      </TableCell>
                      <TableCell rowSpan={rowSpan} className={ENTRY_CELL_CLASS}>
                        {entry.clientName}
                      </TableCell>
                      <TableCell rowSpan={rowSpan} className={`${ENTRY_CELL_CLASS} text-[#101011]`}>
                        {formatDate(entry.checkIn)}
                      </TableCell>
                      <TableCell rowSpan={rowSpan} className={`${ENTRY_CELL_CLASS} text-[#101011]`}>
                        {formatDate(entry.checkOut)}
                      </TableCell>
                      <TableCell rowSpan={rowSpan} className={ENTRY_CELL_CLASS}>
                        {entry.destination}
                      </TableCell>
                    </>
                  )}

                  <TableCell className={BOOKING_CELL_CLASS}>
                    {booking.bookingPlace}
                  </TableCell>
                  <TableCell className={BOOKING_CELL_CLASS}>
                    <BookingTypeBadge type={booking.serviceType} />
                  </TableCell>
                  <TableCell className={BOOKING_CELL_CLASS}>
                    <CurrencyText amount={booking.bookingPrice} currency={entry.currency} />
                  </TableCell>

                  {index === 0 && (
                    <>
                      <TableCell rowSpan={rowSpan} className={ENTRY_CELL_CLASS}>
                        <CurrencyText amount={entry.totalCost} currency={entry.currency} />
                      </TableCell>
                      <TableCell rowSpan={rowSpan} className={ENTRY_CELL_CLASS}>
                        <CurrencyText amount={entry.paidAmount} currency={entry.currency} />
                      </TableCell>
                      <TableCell rowSpan={rowSpan} className={`${ENTRY_CELL_CLASS} text-[#101011]`}>
                        {formatDate(entry.paymentDate)}
                      </TableCell>
                      <TableCell rowSpan={rowSpan} className={ENTRY_CELL_CLASS}>
                        {entry.paymentMethod}
                      </TableCell>
                      <TableCell rowSpan={rowSpan} className="align-middle text-center">
                        <RemainingBadge amount={entry.remainingAmount} currency={entry.currency} />
                      </TableCell>
                      <TableCell rowSpan={rowSpan} className="align-middle text-center">
                        <TableRowActions row={entry} onEdit={onEdit} onDelete={onDelete} />
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ));
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
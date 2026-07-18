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
import { CodeStepperInput } from "./CodeStepperInput";
import { DailyEntry } from "@/types/types";
import { Checkbox } from "../ui/checkbox";

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
  "باكود العميل",
  "المبلغ المسدد",
  "تاريخ الدفع",
  "وسيلة الدفع",
  "المبلغ المتبقي",
  "تاجت",
];

/** Columns that belong to the entry level and span every booking row. */
const ENTRY_CELL_CLASS =
  "align-middle text-center text-[18px] text-[#232323]";

/** Columns that belong to the booking level, rendered once per booking. */
const BOOKING_CELL_CLASS =
  "align-middle text-center text-[18px] text-[#232323] bg-[#FAFAFB] border-x border-[#EDEDF2]";

function CurrencyText({ amount }: { amount: number | string }) {
  const value =
    typeof amount === "number" ? amount : Number(amount) || amount;

  return (
    <span className="font-medium tabular-nums">
      {typeof value === "number" ? (
        <>
          <span className="ml-1 text-[15px] font-normal text-muted-foreground">
            EGP
          </span>
          {value.toLocaleString()}
        </>
      ) : (
        value
      )}
    </span>
  );
}

function RemainingBadge({ amount }: { amount: number | string }) {
  const value = Number(amount) || 0;
  const isSettled = value <= 0;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[13px] font-medium tabular-nums ${isSettled
          ? "bg-[#E7F6EC] text-[#1E9E4C]"
          : "bg-[#FDEDEA] text-[#E0472C]"
        }`}
    >
      <span className="text-[11px] font-normal opacity-80">EGP</span>
      {value.toLocaleString()}
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

interface DailyEntriesTableProps {
  data: DailyEntry[];
  onEditableCodeChange: (entryId: string, value: number) => void;
}

export function DailyEntriesTable({
  data,
  onEditableCodeChange,
}: DailyEntriesTableProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-[#E4E2E9] bg-white text-[14px] text-muted-foreground">
        لا توجد قيود لعرضها
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white ctm-shadow">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="[&_tr]:border-b-0">
            <TableRow className="sticky top-0 z-10 hover:bg-[#F5F6F7] bg-[#F5F6F7] border-none">
              <TableHead className="w-10" />
              {COLUMNS.map((col) => (
                <TableHead
                  key={col}
                  className="whitespace-nowrap py-3 text-[18px] text-[#101011]"
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((entry, entryIndex) => {
              const rowSpan = entry.bookings.length;
              const groupClass =
                entryIndex % 2 === 0 ? "bg-white" : "bg-[#FCFCFD]";

              return entry.bookings.map((booking, index) => (
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
                        {entry.customerCode}
                      </TableCell>
                      <TableCell rowSpan={rowSpan} className={ENTRY_CELL_CLASS}>
                        {entry.employee}
                      </TableCell>
                      <TableCell rowSpan={rowSpan} className={ENTRY_CELL_CLASS}>
                        {entry.customer}
                      </TableCell>
                      <TableCell rowSpan={rowSpan} className={`${ENTRY_CELL_CLASS} text-[#101011]`}>
                        {entry.checkIn}
                      </TableCell>
                      <TableCell rowSpan={rowSpan} className={`${ENTRY_CELL_CLASS} text-[#101011]`}>
                        {entry.checkOut}
                      </TableCell>
                      <TableCell rowSpan={rowSpan} className={ENTRY_CELL_CLASS}>
                        {entry.destination}
                      </TableCell>
                    </>
                  )}

                  <TableCell className={BOOKING_CELL_CLASS}>
                    {booking.location}
                  </TableCell>
                  <TableCell className={BOOKING_CELL_CLASS}>
                    <BookingTypeBadge type={booking.type} />
                  </TableCell>
                  <TableCell className={BOOKING_CELL_CLASS}>
                    <CurrencyText amount={booking.price} />
                  </TableCell>

                  {index === 0 && (
                    <>
                      <TableCell rowSpan={rowSpan} className={ENTRY_CELL_CLASS}>
                        <CurrencyText amount={entry.totalCost} />
                      </TableCell>
                      <TableCell rowSpan={rowSpan} className="align-middle text-center">
                        <CodeStepperInput
                          value={entry.editableCode}
                          onChange={(value) =>
                            onEditableCodeChange(entry.id, value)
                          }
                        />
                      </TableCell>
                      <TableCell rowSpan={rowSpan} className={ENTRY_CELL_CLASS}>
                        <CurrencyText amount={entry.paidAmount} />
                      </TableCell>
                      <TableCell rowSpan={rowSpan} className={`${ENTRY_CELL_CLASS} text-[#101011]`}>
                        {entry.paymentDate}
                      </TableCell>
                      <TableCell rowSpan={rowSpan} className={ENTRY_CELL_CLASS}>
                        {entry.paymentMethod}
                      </TableCell>
                      <TableCell rowSpan={rowSpan} className="align-middle text-center">
                        <RemainingBadge amount={entry.remaining} />
                      </TableCell>
                      <TableCell rowSpan={rowSpan} className={`${ENTRY_CELL_CLASS} text-[#101011]`}>
                        {entry.closedDate}
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
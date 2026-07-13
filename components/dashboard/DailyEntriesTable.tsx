"use client";

import * as React from "react";
import { MoreVertical } from "lucide-react";
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

interface DailyEntriesTableProps {
  data: DailyEntry[];
  onEditableCodeChange: (entryId: string, value: number) => void;
}

export function DailyEntriesTable({
  data,
  onEditableCodeChange,
}: DailyEntriesTableProps) {
  return (
    <Table>
      <TableHeader className="[&_tr]:border-b-0">
        <TableRow className="hover:bg-transparent bg-[#F5F6F7] border-none">
          <TableHead className="w-8" />
          {COLUMNS.map((col) => (
            <TableHead key={col} className="whitespace-nowrap">
              {col}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((entry) => {
          const rowSpan = entry.bookings.length;

          return entry.bookings.map((booking, index) => (
            <TableRow key={booking.id} className="border-b border-[#00000080]">
              {index === 0 && (
                <TableCell rowSpan={rowSpan} className="align-center">
                    <Checkbox />
                </TableCell>
              )}

              {index === 0 && (
                <>
                  <TableCell rowSpan={rowSpan} className="align-center text-center font-medium">
                    {entry.customerCode}
                  </TableCell>
                  <TableCell rowSpan={rowSpan} className="align-center text-center">
                    {entry.employee}
                  </TableCell>
                  <TableCell rowSpan={rowSpan} className="align-center text-center">
                    {entry.customer}
                  </TableCell>
                  <TableCell rowSpan={rowSpan} className="align-center text-center">
                    {entry.checkIn}
                  </TableCell>
                  <TableCell rowSpan={rowSpan} className="align-center text-center">
                    {entry.checkOut}
                  </TableCell>
                  <TableCell rowSpan={rowSpan} className="align-center text-center">
                    {entry.destination}
                  </TableCell>
                </>
              )}

              <TableCell className="border-r border-l border-[#00000080] text-center">{booking.location}</TableCell>
              <TableCell className="border-r border-l border-[#00000080] text-center">{booking.type}</TableCell>
              <TableCell className="border-r border-l border-[#00000080] text-center">{booking.price}</TableCell>

              {index === 0 && (
                <>
                  <TableCell rowSpan={rowSpan} className="align-center text-center">
                    {entry.totalCost}
                  </TableCell>
                  <TableCell rowSpan={rowSpan} className="align-center text-center">
                    <CodeStepperInput
                      value={entry.editableCode}
                      onChange={(value) =>
                        onEditableCodeChange(entry.id, value)
                      }
                    />
                  </TableCell>
                  <TableCell rowSpan={rowSpan} className="align-center text-center">
                    {entry.paidAmount}
                  </TableCell>
                  <TableCell rowSpan={rowSpan} className="align-center text-center">
                    {entry.paymentDate}
                  </TableCell>
                  <TableCell rowSpan={rowSpan} className="align-center text-center">
                    {entry.paymentMethod}
                  </TableCell>
                  <TableCell rowSpan={rowSpan} className="align-center text-center">
                    {entry.remaining}
                  </TableCell>
                  <TableCell rowSpan={rowSpan} className="align-center text-center">
                    {entry.closedDate}
                  </TableCell>
                </>
              )}
            </TableRow>
          ));
        })}
      </TableBody>
    </Table>
  );
}
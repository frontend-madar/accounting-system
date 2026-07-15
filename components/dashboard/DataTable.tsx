"use client";

import { usePathname } from "next/navigation";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    /** Shown instead of rows when `data` is empty. */
    emptyState?: React.ReactNode;
    className?: string;
    rowClassName?: string | ((row: TData) => string);
}

export function DataTable<TData, TValue>({
    columns,
    data,
    emptyState,
    className,
    rowClassName,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

     const pathname = usePathname();
     const isSuppliersPage = pathname === "/dashboard/suppliers";

    return (
        <Table className={className}>
            <TableHeader className="[&_tr]:border-b-0">
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className={` ${isSuppliersPage ? 'bg-[#EDEBF7] h-[65px]' : ' h-[65px] bg-[#F5F6F7] rounded-lg overflow-hidden border-none'} `}>
                        {headerGroup.headers.map((header) => (
                            <TableHead key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext()
                                      )}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            className={
                                `${typeof rowClassName === "function" ? rowClassName(row.original) : rowClassName}  !h-[60px]`
                            }
                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow className="hover:bg-transparent">
                        <TableCell
                            colSpan={columns.length}
                            className="h-32 text-center text-muted-foreground"
                        >
                            {emptyState ?? "لا توجد بيانات لعرضها"}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
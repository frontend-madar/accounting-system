"use client";

import {
    ColumnDef,
    OnChangeFn,
    PaginationState,
    RowSelectionState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
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

interface EmployeeSelectionTableProps<TData> {
    columns: ColumnDef<TData, any>[];
    /** Full (filtered) dataset — selection and pagination are both handled internally. */
    data: TData[];
    getRowId: (row: TData) => string;
    rowSelection: RowSelectionState;
    onRowSelectionChange: OnChangeFn<RowSelectionState>;
    pagination: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
    emptyState?: React.ReactNode;
    className?: string;
}

/**
 * Employee picker table for the payroll run flow.
 *
 * Keeps the full dataset inside the table instance (rather than manually
 * slicing a page) so that "select all" and the selected-count reflect the
 * entire filtered list, not just the rows currently visible on screen.
 */
export function EmployeeSelectionTable<TData>({
    columns,
    data,
    getRowId,
    rowSelection,
    onRowSelectionChange,
    pagination,
    onPaginationChange,
    emptyState,
    className,
}: EmployeeSelectionTableProps<TData>) {
    const table = useReactTable({
        data,
        columns,
        getRowId,
        state: { rowSelection, pagination },
        onRowSelectionChange,
        onPaginationChange,
        enableRowSelection: true,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <Table className={className}>
            <TableHeader className="[&_tr]:border-b-0">
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                        key={headerGroup.id}
                        className="h-[65px] rounded-lg border-none bg-[#F5F6F7] overflow-hidden"
                    >
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
                        <TableRow key={row.id} className="!h-[60px]">
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
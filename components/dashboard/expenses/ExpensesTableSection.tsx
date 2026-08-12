"use client";

import * as React from "react";
import { useMemo, useCallback, useState } from "react";
import { ArrowUpDown, RefreshCw } from "lucide-react";

import { getExpenseColumns } from "./ExpensesColumns";
import { ExpenseRecord } from "@/types/expense.types";
import { DataTable } from "../DataTable";
import { DataTablePagination } from "../Pagination";
import { useDeleteExpense, useExportExpensesPdf, useExportExpensesExcel, useExportExpensesEmail } from "@/hooks/useExpenses";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExportDropdown } from "../shared/ExportDropdown";
import { ConfirmDeleteDialog } from "../shared/ConfirmDeleteDialog";
import { ExpenseForm } from "./UpdateExpenseFrom";
import { Button } from "@/components/ui/button";

interface ExpensesTableSectionProps {
    title?: string;
    onRefresh?: () => void;
    onSortToggle?: () => void;
    onDeleteRow?: (row: ExpenseRecord) => void;
    onEditRow?: (row: ExpenseRecord) => void;
    onDataChange?: () => void;
    data: ExpenseRecord[];
    page: number;
    pageSize: number;
    totalRecords: number;
    isLoading?: boolean;
    onPageChange: (page: number) => void;
    className?: string;
}

export function ExpensesTableSection({
    title = "سجل المصروفات",
    onRefresh,
    onSortToggle,
    onDeleteRow,
    onEditRow,
    onDataChange,
    data,
    page,
    pageSize,
    totalRecords,
    isLoading,
    onPageChange,
    className,
}: ExpensesTableSectionProps) {
    const deleteExpense = useDeleteExpense();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<ExpenseRecord | null>(null);
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

    const { mutate: exportPdf, isPending: isExportingPdf } = useExportExpensesPdf();
    const { mutate: exportExcel, isPending: isExportingExcel } = useExportExpensesExcel();
    const { mutate: exportEmail, isPending: isExportingEmail } = useExportExpensesEmail();

    const handleDeleteClick = useCallback((row: ExpenseRecord) => {
        setSelectedRow(row);
        setDeleteDialogOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!selectedRow) return;

        deleteExpense.mutate(selectedRow.id, {
            onSuccess: () => {
                onDeleteRow?.(selectedRow);
                setDeleteDialogOpen(false);
                setSelectedRow(null);
                onDataChange?.();
            },
            onError: (error) => {
                console.error("Delete failed:", error);
            },
        });
    }, [deleteExpense, onDeleteRow, selectedRow, onDataChange]);

    const handleDialogOpenChange = useCallback((open: boolean) => {
        setDeleteDialogOpen(open);
        if (!open) {
            setSelectedRow(null);
        }
    }, []);

    const handleEdit = useCallback(
        (row: ExpenseRecord) => {
            setEditingExpenseId(row.id);
            setIsFormDialogOpen(true);
            onEditRow?.(row);
        },
        [onEditRow]
    );

    const handleFormSuccess = useCallback(() => {
        setIsFormDialogOpen(false);
        setEditingExpenseId(null);
        onDataChange?.();
    }, [onDataChange]);

    const handleFormCancel = useCallback(() => {
        setIsFormDialogOpen(false);
        setEditingExpenseId(null);
    }, []);

    const handleExportPdf = useCallback(() => {
        exportPdf({});
    }, [exportPdf]);

    const handleExportExcel = useCallback(() => {
        exportExcel({});
    }, [exportExcel]);

    const handleExportEmail = useCallback(
        (email: string) => {
            exportEmail({ to: email });
        },
        [exportEmail]
    );

    const columns = useMemo(
        () =>
            getExpenseColumns({
                onDelete: handleDeleteClick,
                onEdit: handleEdit,
            }),
        [handleDeleteClick, handleEdit]
    );

    return (
        <>
            <section className={`rounded-2xl bg-white ctm-shadow p-5 ${className ?? ""}`}>
                <div className="flex md:items-center flex-col md:flex-row  justify-between gap-4">
                    <h2 className="text-[18px] font-semibold text-[#232323]">{title}</h2>

                    <div className="flex items-center gap-2">
                        <ExportDropdown
                            label="تصدير"
                            className="sm:!w-[111px] w-full"
                            isExportingPdf={isExportingPdf}
                            isExportingExcel={isExportingExcel}
                            isExportingEmail={isExportingEmail}
                            onExportPdf={handleExportPdf}
                            onExportExcel={handleExportExcel}
                            onExportEmail={handleExportEmail}
                        />

                        <Button
                            type="button"
                            onClick={onRefresh}
                            aria-label="تحديث"
                            className="bg-white text-[#1B1B1B] flex h-11 w-11 items-center justify-center rounded-xl border border-[#E4E2E9] hover:bg-[#F8F7FF] hover:border-[#BFB5F2]"
                        >
                            <RefreshCw
                                className={`h-4 w-4 text-[#1B1B1B] ${isLoading ? "animate-spin" : ""
                                    }`}
                            />
                        </Button>

                        <Button
                            type="button"
                            onClick={onSortToggle}
                            aria-label="ترتيب"
                            className="bg-white text-[#1B1B1B] flex h-11 w-11 items-center justify-center rounded-xl border border-[#E4E2E9] hover:bg-[#F8F7FF] hover:border-[#BFB5F2]"
                        >
                            <ArrowUpDown className="h-4 w-4 text-[#1B1B1B]" />
                        </Button>
                    </div>
                </div>

                <div className="mt-4 overflow-x-auto">
                    <DataTable columns={columns} data={data} isLoading={isLoading} />
                </div>

                <DataTablePagination
                    className="mt-4"
                    page={page}
                    pageSize={pageSize}
                    totalRecords={totalRecords}
                    onPageChange={onPageChange}
                />
            </section>

            <ConfirmDeleteDialog
                open={deleteDialogOpen}
                onOpenChange={handleDialogOpenChange}
                onConfirm={handleConfirmDelete}
                isLoading={deleteExpense.isPending}
                title="تأكيد حذف المصروف"
                description={`هل أنت متأكد من حذف المصروف "${selectedRow?.code}"؟ لا يمكن التراجع عن هذا الإجراء.`}
                cancelLabel="إلغاء"
                confirmLabel="حذف"
                loadingLabel="جاري الحذف..."
            />

            <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingExpenseId ? "تعديل المصروف" : "إضافة مصروف جديد"}
                        </DialogTitle>
                    </DialogHeader>
                    <ExpenseForm
                        mode={editingExpenseId ? "update" : "create"}
                        expenseId={editingExpenseId}
                        onSuccess={handleFormSuccess}
                        onCancel={handleFormCancel}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}
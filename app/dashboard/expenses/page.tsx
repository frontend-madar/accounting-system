"use client";

import * as React from "react";
import { useState } from "react";


import { useExpenses, useExpenseDashboard, useDeleteExpense } from "@/hooks/useExpenses";
import type { ExpenseSettlementValues } from "@/validations/ExpenseSettlement";
import type { ExpenseStat } from "@/types/types";
import type { ExpenseRecord, GetExpensesParams } from "@/types/expense.types";
import { Topbar } from "@/components/dashboard/Topbar";
import { ExpenseStatsSection } from "@/components/dashboard/expenses/ExpenseStatsSection";
import ExpenseSettlement from "@/components/dashboard/expenses/ExpenseSettlement";
import { ExpensesTableSection } from "@/components/dashboard/expenses/ExpensesTableSection";
import EmptyState from "@/components/dashboard/shared/EmptyState";

const PAGE_SIZE = 10;

const EMPTY_FILTERS: ExpenseSettlementValues = {
    expenseCode: "",
    period: "",
    expenseCategory: "",
    status: "",
};

export default function ExpensesPage() {
    const [filters, setFilters] = useState<ExpenseSettlementValues>(EMPTY_FILTERS);
    const [page, setPage] = useState(1);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const queryParams: GetExpensesParams = {
        page,
        limit: PAGE_SIZE,
        code: filters.expenseCode || undefined,
        status: filters.status || undefined,
        category: filters.expenseCategory || undefined,
        period: filters.period || undefined,
        sortBy: "expenseDate",
        sortOrder,
    };

    const { data: expensesRes, isLoading, refetch } = useExpenses(queryParams);
    const { data: dashboardRes, isLoading: isDashboardLoading } = useExpenseDashboard();
    const deleteExpense = useDeleteExpense();

    const stats: ExpenseStat[] = [
        {
            id: "total",
            label: "إجمالي المصروفات",
            value: (dashboardRes?.data.totalExpenses ?? 0).toLocaleString(),
            currency: "EGP",
            icon: "total",
            iconColor: "#463BAF",
            iconBg: "#EFEDFB",
        },
        {
            id: "month",
            label: "مصروفات هذا الشهر",
            value: (dashboardRes?.data.monthExpenses ?? 0).toLocaleString(),
            currency: "EGP",
            icon: "month",
            iconColor: "#0F9D58",
            iconBg: "#E6F7EE",
        },
        {
            id: "count",
            label: "عدد مصروفات الشهر",
            value: String(dashboardRes?.data.monthCount ?? 0),
            icon: "count",
            iconColor: "#DB4437",
            iconBg: "#FCEAE9",
        },
    ];

    function handleApplyFilters(values: ExpenseSettlementValues) {
        setFilters(values);
        setPage(1);
    }

    function handleResetFilters() {
        setFilters(EMPTY_FILTERS);
        setPage(1);
    }

    function handleDeleteRow(row: ExpenseRecord) {
        deleteExpense.mutate(row.id);
    }

    function toggleSort() {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    }

    const expenses = expensesRes?.data.data ?? [];
    const hasNoExpenses = !isLoading && expenses.length === 0;

    return (
        <div className="space-y-6 px-4">
            <Topbar title='إضافة مصروف' />


            {hasNoExpenses ? (
                <EmptyState
                    title="لا توجد فواتير حتى الآن"
                    description="ابدأ بإضافة أول فاتورة لإدارة مبيعات شركتك."
                    buttonText="إضافة فاتورة"
                    href="/dashboard/expenses/add-expense"
                />
            ) : (
                <>
                    <ExpenseStatsSection stats={stats} isLoading={isDashboardLoading} />

                    <ExpenseSettlement
                        initialValues={filters}
                        onApply={handleApplyFilters}
                        onReset={handleResetFilters}
                        isLoading={isDashboardLoading}
                    />
                    <ExpensesTableSection
                        data={expenses}
                        page={expensesRes?.data.page ?? page}
                        pageSize={expensesRes?.data.limit ?? PAGE_SIZE}
                        totalRecords={expensesRes?.data.total ?? 0}
                        isLoading={isLoading}
                        onPageChange={setPage}
                        onRefresh={() => refetch()}
                        onSortToggle={toggleSort}
                        onDeleteRow={handleDeleteRow}
                    />
                </>
            )}
        </div>
    );
}
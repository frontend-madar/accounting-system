"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { Plus, ArrowUpDown, RefreshCw } from "lucide-react";

import { getEmployeeColumns } from "./EmployeesColumns";
import { DataTable } from "../DataTable";
import { DataTablePagination } from "../Pagination";
import MainButton from "../MainButton";
import SecondaryButton from "../SecondaryButton";
import StaffDownsizing from "./StaffDownsizing";
import { useEmployees, useDeleteEmployee } from "@/hooks/use-employee";
import { EmployeeData } from "@/types/employee.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UpdateEmployeeForm } from "./UpdateEmployeeForm";

const PAGE_SIZE = 5;

interface EmployeesTableSectionProps {
  title?: string;
  addButtonLabel?: string;
  className?: string;
}

export function EmployeesTableSection({
  title = "سجل الموظفين",
  addButtonLabel = "اضافة موظف",
  className,
}: EmployeesTableSectionProps) {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: "", department: "" });
  const [sortBy, setSortBy] = useState<"asc" | "desc" | undefined>(undefined);
  const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeData | null>(null);

  const { data: employeesRes, isLoading, refetch } = useEmployees({
    ...filters,
    sortBy,
    page,
    limit: PAGE_SIZE,
  });
  const { mutate: deleteEmployee, isPending: isDeleting } = useDeleteEmployee();

  const rows = employeesRes?.data.data ?? [];
  const totalRecords = employeesRes?.data.total ?? 0;

  function handleFilterChange(newFilters: typeof filters) {
    setFilters(newFilters);
    setPage(1);
  }

  function handleRefresh() {
    setFilters({ search: "", department: "" });
    setSortBy(undefined);
    setPage(1);
    refetch();
  }

  function handleToggleSort() {
    setSortBy((prev) => (prev === "desc" ? "asc" : "desc"));
    setPage(1);
  }

  function confirmDelete() {
    if (!employeeToDelete) return;
    deleteEmployee(employeeToDelete.id, {
      onSuccess: () => setEmployeeToDelete(null),
    });
  }

  const [employeeToEdit, setEmployeeToEdit] = useState<EmployeeData | null>(null);


  const columns = useMemo(() =>
    getEmployeeColumns({
      onEdit: (employee) => setEmployeeToEdit(employee),
      onDelete: (employee) => setEmployeeToDelete(employee),
    }),
    []
  );

  return (
    <section className={className ?? ""}>
      <StaffDownsizing onFilterChange={handleFilterChange}   />

      <div className="rounded-2xl bg-white ctm-shadow p-4 mt-4">
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
          <h2 className="text-[18px] font-semibold text-[#232323]">{title}</h2>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <SecondaryButton
              text={""}
              icon={<RefreshCw className="h-4 w-4" />}
              className="!w-[187px] sm:!w-12"
              onClick={handleRefresh}
            />
            <SecondaryButton
              text={""}
              icon={<ArrowUpDown className="h-4 w-4" />}
              className="!w-[187px] sm:!w-12"
              onClick={handleToggleSort}
            />
            <MainButton text={addButtonLabel} icon={<Plus className="h-4 w-4" />} className="!w-[187px]" href="employees/create" />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <DataTable columns={columns} data={rows} isLoading={isLoading} />
        </div>

        <DataTablePagination
          className="mt-4"
          page={page}
          pageSize={PAGE_SIZE}
          totalRecords={totalRecords}
          onPageChange={setPage}
        />
      </div>

    
      <AlertDialog open={!!employeeToDelete} onOpenChange={(open) => !open && setEmployeeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف الموظف {employeeToDelete?.fullName}؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UpdateEmployeeForm
        employee={employeeToEdit}
        open={!!employeeToEdit}
        onOpenChange={(open) => !open && setEmployeeToEdit(null)}
      />
    </section>
  );
}
"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Printer, Trash2, X } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import MainButton from "../shared/MainButton";
import SecondaryButton from "../shared/SecondaryButton";
import { ConfirmDeleteDialog } from "../shared/ConfirmDeleteDialog";
import {
  useInvoice,
  useDeleteInvoice,
  useDeleteInvoicePayment,
  useDownloadInvoicePdf,
} from "@/hooks/use-invoice";

interface InvoiceDetailProps {
  invoiceId: string;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "-";
  return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
}

function InfoField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <span className="text-[14px] font-semibold text-[#232323] md:text-[17px]">
        {label}
      </span>
      <div className="flex h-[47px] w-full items-center rounded-xl border border-[#C8C2FC] bg-white px-4 text-[15px] font-medium text-[#232323]">
        {value}
      </div>
    </div>
  );
}

function InvoiceDetailSkeleton() {
  return (
    <div className="space-y-8 rounded-2xl ctm-shadow bg-white p-2 md:p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-[47px] w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function InvoiceDetail({ invoiceId }: InvoiceDetailProps) {
  const router = useRouter();
  const { data: invoiceRes, isLoading } = useInvoice(invoiceId);
  const invoice = invoiceRes?.data;

  const { mutate: deleteInvoice, isPending: isDeletingInvoice } = useDeleteInvoice();
  const { mutate: deletePayment, isPending: isDeletingPayment } = useDeleteInvoicePayment();
  const { mutate: downloadPdf, isPending: isDownloading } = useDownloadInvoicePdf();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingPaymentId, setDeletingPaymentId] = useState<string | null>(null);

  if (isLoading || !invoice) {
    return <InvoiceDetailSkeleton />;
  }

  return (
    <div className="space-y-8 rounded-2xl ctm-shadow bg-white p-2 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] md:text-[28px] font-bold text-[#171A1F]">
            فاتورة #{invoice.invoiceNumber}
          </h1>
          <p className="mt-1 text-[14px] text-muted-foreground">
            تاريخ الإنشاء: {formatDate(invoice.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SecondaryButton
            text={isDownloading ? "جاري التحميل..." : "طباعة"}
            icon={<Printer className="h-4 w-4" />}
            disabled={isDownloading}
            onClick={() =>
              downloadPdf({ invoiceId: invoice.id, invoiceNumber: invoice.invoiceNumber })
            }
          />
          <MainButton
            text="تعديل"
            icon={<Pencil className="h-4 w-4" />}
            onClick={() => router.push(`/dashboard/invoices/${invoice.id}/edit`)}
          />
          <button
            type="button"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[14px] font-medium text-red-600 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            حذف
          </button>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-[18px] font-bold text-[#0F1219]">بيانات العميل والموظف</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoField label="اسم العميل" value={invoice.clientName} />
          <InfoField label="اسم الموظف" value={invoice.employeeName} />
          <InfoField label="الحالة" value={invoice.status} />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-[18px] font-bold text-[#0F1219]">تفاصيل الخدمة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField label="الخدمة" value={invoice.service} />
          <InfoField
            label="السعر الاجمالي"
            value={`${invoice.totalPrice.toLocaleString()} ${invoice.currency || ""}`}
          />
        </div>

        {invoice.includes.length > 0 && (
          <div className="mt-4 space-y-2">
            <span className="text-[14px] font-semibold text-[#232323] md:text-[17px]">
              يشمل
            </span>
            <div className="flex flex-wrap gap-2">
              {invoice.includes.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="inline-flex items-center gap-1 rounded-full bg-[#EFEBFB] px-3 py-1.5 text-[13px] text-[#463BAF]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[18px] font-bold text-[#0F1219]">الدفعات</h2>
          <InfoField
            label=""
            value={`المتبقي: ${invoice.remainingAmount.toLocaleString()} ${invoice.currency || ""}`}
          />
        </div>

        {invoice.payments.length === 0 ? (
          <p className="text-muted-foreground text-[14px]">لا توجد دفعات مسجلة</p>
        ) : (
          <div className="space-y-3">
            {invoice.payments.map((payment) => (
              <div
                key={payment.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 shadow-md p-4 rounded-md bg-white relative"
              >
                <button
                  type="button"
                  onClick={() => setDeletingPaymentId(payment.id)}
                  className="absolute left-3 top-3 text-muted-foreground hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>

                <InfoField
                  label="المبلغ المدفوع"
                  value={payment.paidAmount.toLocaleString()}
                />
                <InfoField label="تاريخ الدفع" value={formatDate(payment.paymentDate)} />
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        isLoading={isDeletingInvoice}
        title="حذف الفاتورة"
        description="هل أنت متأكد من حذف هذه الفاتورة؟ لا يمكن التراجع عن هذا الإجراء."
        onConfirm={() =>
          deleteInvoice(invoice.id, {
            onSuccess: () => router.push("/dashboard/invoices"),
          })
        }
      />

      <ConfirmDeleteDialog
        open={!!deletingPaymentId}
        onOpenChange={(open) => !open && setDeletingPaymentId(null)}
        isLoading={isDeletingPayment}
        title="حذف الدفعة"
        description="هل أنت متأكد من حذف هذه الدفعة؟ لا يمكن التراجع عن هذا الإجراء."
        onConfirm={() => {
          if (deletingPaymentId) {
            deletePayment(
              { invoiceId: invoice.id, paymentId: deletingPaymentId },
              { onSuccess: () => setDeletingPaymentId(null) }
            );
          }
        }}
      />
    </div>
  );
}
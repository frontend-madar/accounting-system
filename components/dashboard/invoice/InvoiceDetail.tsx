"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Printer, Trash2, X, Calendar, User, Tag, DollarSign, CreditCard, FileText, Package, Users } from "lucide-react";

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
import { cn } from "@/lib/utils";

interface InvoiceDetailProps {
  invoiceId: string;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "-";
  return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
}

function getStatusStyles(status: string): string {
  const statusMap: Record<string, string> = {
    "مكتملة": "bg-[#E6F6F4] text-[#1BA915] border-[#1BA915]/20",
    "كنسل": "bg-[#FCEADF] text-[#E0673A] border-[#E0673A]/20",
    "باقي الدفع": "bg-[#FBF3D9] text-[#C79A1E] border-[#C79A1E]/20",
    "قيد المراجعة": "bg-[#E8EEFD] text-[#3D6BEA] border-[#3D6BEA]/20",
  };
  return statusMap[status] || "bg-[#F1F1F3] text-[#5C5F63] border-[#5C5F63]/20";
}

function InfoField({ 
  label, 
  value, 
  icon: Icon,
  className 
}: { 
  label: string; 
  value: React.ReactNode; 
  icon?: React.ElementType;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <span className="text-[13px] font-medium text-[#6C7075] flex items-center gap-1.5">
        {Icon && <Icon className="h-4 w-4 text-[#8B8E92]" />}
        {label}
      </span>
      <div className="flex min-h-[47px] w-full items-center rounded-xl border border-[#E4E5E7] bg-[#FAFBFC] px-4 text-[15px] font-medium text-[#171A1F] transition-all duration-200 hover:border-[#40369F]/30 hover:bg-white">
        {value}
      </div>
    </div>
  );
}

function InvoiceDetailSkeleton() {
  return (
    <div className="space-y-8 rounded-3xl ctm-shadow bg-white p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-11 w-24 rounded-xl" />
          <Skeleton className="h-11 w-24 rounded-xl" />
          <Skeleton className="h-11 w-24 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
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
    <div className="space-y-8">
      {/* Header Card */}
      <div className="rounded-3xl ctm-shadow bg-white p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="hidden md:flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#40369F] to-[#322A7C] shadow-lg shadow-[#40369F]/20">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-[22px] md:text-[28px] font-bold text-[#171A1F]">
                فاتورة #{invoice.invoiceNumber}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1.5 text-[14px] text-[#6C7075]">
                  <Calendar className="h-4 w-4" />
                  {formatDate(invoice.createdAt)}
                </span>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-medium border ${getStatusStyles(invoice.status)}`}>
                  {invoice.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SecondaryButton
              text={isDownloading ? "جاري التحميل..." : "طباعة"}
              icon={<Printer className="h-4 w-4" />}
              disabled={isDownloading}
              onClick={() =>
                downloadPdf({ invoiceId: invoice.id, invoiceNumber: invoice.invoiceNumber })
              }
              className="shadow-sm hover:shadow-md transition-all duration-300"
            />
            <MainButton
              text="تعديل"
              icon={<Pencil className="h-4 w-4" />}
              onClick={() => router.push(`/dashboard/invoices/${invoice.id}/edit`)}
              className="shadow-sm hover:shadow-md transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[14px] font-medium text-red-600 transition-all duration-300 hover:bg-red-100 hover:border-red-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Trash2 className="h-4 w-4" />
              حذف
            </button>
          </div>
        </div>
      </div>

      {/* Client & Employee Info */}
      <div className="rounded-3xl ctm-shadow bg-white p-4 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#40369F] to-[#322A7C]"></div>
          <h2 className="text-[20px] font-bold text-[#171A1F]">بيانات العميل والموظف</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoField 
            label="اسم العميل" 
            value={invoice.clientName} 
            icon={User}
          />
          <InfoField 
            label="اسم الموظف" 
            value={invoice.employeeName} 
            icon={Users}
          />
          <InfoField 
            label="الحالة" 
            value={
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-medium border ${getStatusStyles(invoice.status)}`}>
                {invoice.status}
              </span>
            } 
            icon={Tag}
          />
        </div>
      </div>

      {/* Service Details */}
      <div className="rounded-3xl ctm-shadow bg-white p-4 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#40369F] to-[#322A7C]"></div>
          <h2 className="text-[20px] font-bold text-[#171A1F]">تفاصيل الخدمة</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField 
            label="الخدمة" 
            value={invoice.service} 
            icon={Package}
          />
          <InfoField
            label="السعر الاجمالي"
            value={
              <span className="text-[#40369F] font-bold">
                {invoice.totalPrice.toLocaleString()} {invoice.currency || "ر.س"}
              </span>
            } 
            icon={DollarSign}
          />
        </div>

        {invoice.includes.length > 0 && (
          <div className="mt-6 pt-6 border-t border-[#F0F0F2]">
            <span className="text-[14px] font-semibold text-[#232323] flex items-center gap-2 mb-3">
              <Package className="h-4 w-4 text-[#40369F]" />
              يشمل
            </span>
            <div className="flex flex-wrap gap-2">
              {invoice.includes.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#F5F6FF] to-[#EDEEFF] px-4 py-2 text-[13px] font-medium text-[#40369F] border border-[#D8D2F6] shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#40369F]"></span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Payments Section */}
      <div className="rounded-3xl ctm-shadow bg-white p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#40369F] to-[#322A7C]"></div>
            <h2 className="text-[20px] font-bold text-[#171A1F]">الدفعات</h2>
          </div>
          <div className="bg-gradient-to-r from-[#F5F6FF] to-[#EDEEFF] rounded-xl px-4 py-2.5 border border-[#D8D2F6]">
            <span className="text-[14px] font-medium text-[#6C7075]">المتبقي: </span>
            <span className="text-[16px] font-bold text-[#40369F]">
              {invoice.remainingAmount.toLocaleString()} {invoice.currency || "ر.س"}
            </span>
          </div>
        </div>

        {invoice.payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-[#FAFBFC] rounded-2xl border-2 border-dashed border-[#E4E5E7]">
            <CreditCard className="h-12 w-12 text-[#B1B2B4] mb-3" />
            <p className="text-[16px] font-medium text-[#6C7075]">لا توجد دفعات مسجلة</p>
            <p className="text-[14px] text-[#8B8E92] mt-1">سيتم عرض الدفعات هنا عند إضافتها</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {invoice.payments.map((payment, index) => (
              <div
                key={payment.id}
                className="group relative rounded-2xl border border-[#E4E5E7] bg-[#FAFBFC] p-5 transition-all duration-300 hover:border-[#40369F]/30 hover:bg-white hover:shadow-lg hover:shadow-[#40369F]/5"
              >
                <button
                  type="button"
                  onClick={() => setDeletingPaymentId(payment.id)}
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-md hover:bg-red-500 hover:text-white transition-all duration-300">
                    <X className="h-3.5 w-3.5" />
                  </div>
                </button>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#40369F]/10 to-[#322A7C]/10">
                    <CreditCard className="h-5 w-5 text-[#40369F]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#6C7075]">الدفعة #{index + 1}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#6C7075]">المبلغ</span>
                    <span className="text-[16px] font-bold text-[#171A1F]">
                      {payment.paidAmount.toLocaleString()} {invoice.currency || "ر.س"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#6C7075]">التاريخ</span>
                    <span className="text-[14px] font-medium text-[#171A1F] flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#8B8E92]" />
                      {formatDate(payment.paymentDate)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialogs */}
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
 
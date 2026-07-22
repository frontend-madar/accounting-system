// components/dashboard/clients/UpdateClientForm.tsx
"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

 
import { FormSection } from "../invoice/FormSection";
import { InvoiceTextField } from "../invoice/TextField";
import { SelectField } from "../invoice/SelectField";
import { FieldLabel } from "../invoice/FieldLabel";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MainButton from "../MainButton";
import SecondaryButton from "../SecondaryButton";
import { useUpdateClient } from "@/hooks/use-client";
import { ClientData, ClientType, UpdateClientPayload } from "@/types/client.types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { clientFormSchema, ClientFormValues } from "@/validations/client-schema";

interface UpdateClientFormProps {
    client: ClientData | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UpdateClientForm({ client, open, onOpenChange }: UpdateClientFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [clientType, setClientType] = useState<ClientType>(client?.clientType ?? "individual");
    const { mutate: updateClient, isPending } = useUpdateClient();

    const {
        control,
        register,
        handleSubmit,
        formState: { errors, dirtyFields },
    } = useForm<ClientFormValues>({
        resolver: zodResolver(clientFormSchema),
        values: client
            ? {
                  clientType: client.clientType,
                  clientName: client.name,
                  clientPhone: client.mobile,
                  clientEmail: client.email,
                  clientCountry: client.country,
                  clientCity: client.city,
                  taxId: client.taxNumber ?? "",
                  idNumber: client.taxCard ?? "",
                  commercialRecord: client.commercialRegister ?? "",
                  notes: client.notes ?? "",
                  currency: client.currency ?? "",
              }
            : undefined,
    });

    // Keep local clientType radio state in sync whenever a different client is opened.
     useEffect(() => {
        if (client) setClientType(client.clientType);
    }, [client]);

    const handleFileSelect = (file: File) => {
        if (file.type !== "application/pdf") {
            toast.error("الملف يجب أن يكون بصيغة PDF فقط");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error("حجم الملف يجب ألا يتجاوز 10 ميجابايت");
            return;
        }
        setSelectedFile(file);
    };

    function onSubmit(values: ClientFormValues) {
        if (!client) return;

        const payload: UpdateClientPayload = {};

        if (clientType !== client.clientType) payload.clientType = clientType;
        if (dirtyFields.clientName) payload.name = values.clientName;
        if (dirtyFields.clientPhone) payload.mobile = values.clientPhone;
        if (dirtyFields.clientEmail) payload.email = values.clientEmail;
        if (dirtyFields.clientCountry) payload.country = values.clientCountry;
        if (dirtyFields.clientCity) payload.city = values.clientCity;
        if (dirtyFields.taxId) payload.taxNumber = values.taxId;
        if (dirtyFields.idNumber) payload.taxCard = values.idNumber;
        if (dirtyFields.commercialRecord) payload.commercialRegister = values.commercialRecord;
        if ((dirtyFields as any).notes) payload.notes = (values as any).notes;
        if (selectedFile) payload.attachments = selectedFile;

        if (Object.keys(payload).length === 0) {
            toast.info("لم يتم تغيير أي بيانات");
            return;
        }

        updateClient(
            { id: client.id, payload },
            {
                onSuccess: () => {
                    setSelectedFile(null);
                    onOpenChange(false);
                },
            }
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[90vw] max-w-[90vw] !max-h-[90vh] overflow-y-auto">
                <DialogHeader className="mt-8">
                    <DialogTitle>تعديل بيانات العميل</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-2">
                    <FormSection title="بيانات العميل">
                        <div>
                            <FieldLabel htmlFor={"clientType"} dropdown={false}>
                                <span className="text-[#232323] text-[14px] md:text-[18px] mb-2"> نوع العميل </span>
                            </FieldLabel>
                            <RadioGroup
                                value={clientType}
                                onValueChange={(value) => setClientType(value as ClientType)}
                                className="flex items-center gap-4"
                            >
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <RadioGroupItem value="individual" id="update_individual" />
                                    <span className="text-[#232323] text-[16px]">فردي</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <RadioGroupItem value="business" id="update_business" />
                                    <span className="text-[#232323] text-[16px]">تجاري</span>
                                </label>
                            </RadioGroup>
                        </div>
                    </FormSection>

                    <FormSection title="">
                        <InvoiceTextField
                            label="الاسم الكامل / الاسم التجاري"
                            placeholder="ادخل اسم العميل"
                            error={errors.clientName?.message}
                            {...register("clientName")}
                        />
                        <InvoiceTextField
                            label="رقم الجوال"
                            placeholder="ادخل رقم الجوال"
                            inputMode="tel"
                            error={errors.clientPhone?.message}
                            {...register("clientPhone")}
                        />
                        <InvoiceTextField
                            label="البريد الإلكتروني"
                            placeholder="ادخل البريد الإلكتروني"
                            inputMode="email"
                            error={errors.clientEmail?.message}
                            {...register("clientEmail")}
                        />
                        <InvoiceTextField
                            label="الدولة"
                            placeholder="ادخل الدولة"
                            error={errors.clientCountry?.message}
                            {...register("clientCountry")}
                        />
                        <InvoiceTextField
                            label="المدينة"
                            placeholder="ادخل المدينة"
                            error={errors.clientCity?.message}
                            {...register("clientCity")}
                        />
                        <InvoiceTextField
                            label="سجل تجاري (اختياري)"
                            placeholder="ادخل رقم السجل التجاري"
                            error={errors.commercialRecord?.message}
                            {...register("commercialRecord")}
                        />
                    </FormSection>

                    <FormSection title="البيانات المالية">
                        <InvoiceTextField
                            label="الرقم الضريبي"
                            placeholder="مثال: 312456789"
                            error={errors.taxId?.message}
                            {...register("taxId")}
                        />
                        <InvoiceTextField
                            label="البطاقة الضريبية"
                            placeholder="ادخل رقم البطاقة الضريبية"
                            error={errors.idNumber?.message}
                            {...register("idNumber")}
                        />
                    </FormSection>

                    <div>
                        <FieldLabel htmlFor={"notes"} dropdown={false}>
                            <span className="text-[#232323] text-[14px] md:text-[18px] mb-2">ملاحظات</span>
                        </FieldLabel>
                        <Textarea
                            id="notes"
                            className="h-[132px] border border-[#C0C0C0] text-[#40369F] md:text-[19px] text-[15px]"
                            placeholder="اضف وصف..."
                            {...register("notes" as any)}
                        />
                    </div>

                    <div>
                        <FieldLabel htmlFor={"attachments"} dropdown={false}>
                            <span className="text-[#232323] text-[14px] md:text-[18px] mb-2">المرفقات (اختياري لتغيير الملف الحالي)</span>
                        </FieldLabel>
                        <div
                            className="h-[132px] bg-[#FAFCFE] border border-dashed border-[#C0C1C3] rounded-md flex items-center justify-between px-4 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer.files?.[0];
                                if (file) handleFileSelect(file);
                            }}
                        >
                            <FileText className="w-16 h-16 text-gray-500" strokeWidth={1.5} />
                            <div className="flex-1 text-center text-[15px]">
                                {selectedFile ? (
                                    <span className="text-[#0088FF]">{selectedFile.name}</span>
                                ) : (
                                    <>
                                        <span className="text-[#0F1219]">افلت الملف هنا</span>
                                        <span className="px-1">او</span>
                                        <span className="text-[#0088FF]">اختر من جهازك</span>
                                    </>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileSelect(file);
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
                        <SecondaryButton
                            type="button"
                            text="إلغاء"
                            icon={null}
                            onClick={() => onOpenChange(false)}
                            className="!w-[130px]"
                        />
                        <MainButton text="حفظ التعديلات" icon={null} className="!w-[150px]" disabled={isPending} />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
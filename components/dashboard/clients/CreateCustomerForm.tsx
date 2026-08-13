"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Plus, X } from "lucide-react";
import { useRef, useState } from "react";

import {
    InvoiceFormValues,
} from "@/validations/Invoice";
import { FormSection } from "../invoice/FormSection";
import { InvoiceTextField } from "../invoice/TextField";
import { SelectField } from "../invoice/SelectField";
import { FieldLabel } from "../invoice/FieldLabel";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MainButton from "../shared/MainButton";
import SecondaryButton from "../shared/SecondaryButton";

import { useCreateClient } from "@/hooks/use-client";
import { toast } from "sonner";
import { ClientType } from "@/types/client.types";
import { clientFormSchema, ClientFormValues } from "@/validations/client-schema";
import { useSyncCurrencies } from "@/hooks/useSyncCurrencies";
import { useCurrencyStore } from "@/store/currency.store";
import { cn } from "@/lib/utils";
import FileUploadField from "../shared/FileUploadField";


interface CreateInvoiceFormProps {
    invoiceNumber?: string;
    onSaveDraft?: (values: Partial<InvoiceFormValues>) => void;
    onSaveAndPrint?: (values: InvoiceFormValues) => void;
}

export function CreateCustomerForm({
    onSaveDraft,
}: CreateInvoiceFormProps) {

    const {
        control,
        register,
        handleSubmit,
        setValue,
        watch,
        getValues,
        formState: { errors },
    } = useForm<ClientFormValues>({
        resolver: zodResolver(clientFormSchema),
        defaultValues: {
            clientType: "individual",
            clientName: "",
            clientPhone: "",
            clientEmail: "",
            clientCountry: "",
            clientCity: "",
            taxId: "",
            idNumber: "",
            commercialRecord: "",
            currency: "",
        },
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [clientType, setClientType] = useState<ClientType>("individual");

    const { mutate: createClient, isPending } = useCreateClient();

    useSyncCurrencies();
    const currencyOptions = useCurrencyStore((s) => s.currencyOptions);


    function onSubmit(values: ClientFormValues) {
        createClient({
            clientType,
            name: values.clientName,
            email: values.clientEmail,
            mobile: values.clientPhone,
            country: values.clientCountry,
            city: values.clientCity,
            commercialRegister: values.commercialRecord,
            taxCard: values.idNumber,
            taxNumber: values.taxId,
            currency: values.currency,
            notes: values.notes,
            attachments: selectedFile,
        });
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 rounded-2xl  ctm-shadow bg-white p-2 md:p-6"
        >

            <FormSection title="بيانات العميل" >
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
                            <RadioGroupItem
                                value="individual"
                                id="individual"
                                className="w-6 h-6 border-[#BEBCC1] data-[state=checked]:border-[#463BAF] [&_svg]:w-4 [&_svg]:h-4 [&_svg]:fill-[#463BAF] [&_svg]:stroke-none"
                            />
                            <span className="text-[#232323] text-[16px]">فردي</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <RadioGroupItem
                                value="business"
                                id="business"
                                className="w-6 h-6 border-[#BEBCC1] data-[state=checked]:border-[#463BAF] [&_svg]:w-4 [&_svg]:h-4 [&_svg]:fill-[#463BAF] [&_svg]:stroke-none"
                            />
                            <span className="text-[#232323] text-[16px]">تجاري</span>
                        </label>
                    </RadioGroup>
                </div>
            </FormSection>


            <FormSection title="">
                <InvoiceTextField
                    label="الاسم الكامل / الاسم التجاري"
                    placeholder="  ادخل اسم العميل  "
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
                    label="المدينة"
                    placeholder="ادخل المدينة"
                    error={errors.clientCity?.message}
                    {...register("clientCity")}
                />
                <InvoiceTextField
                    label="الدولة"
                    placeholder="ادخل الدولة"
                    error={errors.clientCountry?.message}
                    {...register("clientCountry")}
                />
                <InvoiceTextField
                    label=" سجل تجاري (اختياري)  "
                    placeholder="ادخل رقم السجل التجاري"
                    error={errors.commercialRecord?.message}
                    {...register("commercialRecord")}
                />
                <InvoiceTextField
                    label=" الرقم الضريبي (اختياري)  "
                    placeholder="ادخل الرقم الضريبي"
                    error={errors.idNumber?.message}
                    {...register("idNumber")}
                />
            </FormSection>

            <FormSection title="البيانات المالية">
                <InvoiceTextField
                    label="الرقم الضريبي"
                    placeholder=" مثال: 312456789  "
                    error={errors.taxId?.message}
                    {...register("taxId")}
                />
                <Controller
                    control={control}
                    name="currency"
                    render={({ field }) => (
                        <SelectField
                            label="العملة"
                            placeholder="اختر العملة"
                            value={field.value}
                            onChange={field.onChange}
                            options={currencyOptions}
                            error={errors.currency?.message}
                        />
                    )}
                />
            </FormSection>



            <div className={cn("grid gap-5 p-5 md:grid-cols-2")}>
                {/* Notes */}
                <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-slate-50 shadow-sm transition-all duration-300 hover:shadow-md p-4">
                    <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F3FF] text-[#463BAF]">
                            <FileText className="h-5 w-5" strokeWidth={1.7} />
                        </div>

                        <div>
                            <FieldLabel htmlFor="notes" dropdown={false}>
                                <span className="text-[16px] font-bold text-[#232323] md:text-[18px]">
                                    ملاحظات
                                </span>
                            </FieldLabel>

                            <p className="mt-0.5 text-xs text-[#8A8D91] md:text-sm">
                                أضف أي تفاصيل أو ملاحظات إضافية
                            </p>
                        </div>
                    </div>

                    <div className="relative flex-1 mt-10">
                        <Textarea
                            id="notes"
                            placeholder="اكتب ملاحظاتك هنا..."
                            className="h-full w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-4 text-[15px] leading-7 text-[#40369F] shadow-sm outline-none transition-all duration-20 placeholder:text-[#A5A7AA hover:border-[#B8B2E0 focus:border-[#463BAF] focus:bg-white focus:ring-4 focus:ring-[#463BAF]/10 focus:shadow-[0_4px_18px_rgba(70,59,175,0.08) md:min-h-[150px] md:text-[17px] "
                            {...register("notes")}
                        />

                        {/* Character / writing hint */}
                        <div className="pointer-events-none absolute bottom-3 left-4 text-[11px] text-[#B0B2B5]">
                            ملاحظات إضافية
                        </div>
                    </div>
                </div>



                {/* Attachments */}
                <FileUploadField
                    label="المرفقات"
                    description="يمكنك إرفاق ملف PDF واحد بحد أقصى."
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                />
            </div>



            <div className="flex items-center  gap-3 border-t border-border pt-5">
                <MainButton text=" حفظ العميل" icon={<Plus className="h-4 w-4" />} disabled={isPending} />
                <SecondaryButton text="   إلغاء" icon={<X className="h-4 w-4" />} className="!w-[110px]" />
            </div>
        </form>
    );
}
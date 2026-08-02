"use client";

import { useRef } from "react";
import { FileText, UploadCloud, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { FieldLabel } from "../invoice/FieldLabel";

interface FileUploadFieldProps {
    label?: string;
    description?: string;
    selectedFile?: File | null;
    setSelectedFile: (file: File | null) => void;
    error?: string;
    cardClassName?: string;
}

export default function FileUploadField({
    label = "المرفقات",
    description = "يمكنك إرفاق ملف PDF واحد بحد أقصى.",
    selectedFile,
    setSelectedFile,
    error,
    cardClassName,
}: FileUploadFieldProps) {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        if (file.type === "application/pdf") {
            setSelectedFile(file);
        }
    };

    return (
        <Card
            className={cn(
                "overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-slate-50 shadow-sm transition-all duration-300 hover:shadow-md",
                cardClassName
            )}
        >
            <div className="border-slate-100 px-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-1.5 rounded-full bg-gradient-to-b from-[#463BAF] to-[#0e065e]" />
                    <div>
                        <FieldLabel htmlFor="attachments" dropdown={false}>
                            <span className="text-xl font-bold text-slate-900">
                                {label}
                            </span>
                        </FieldLabel>
                        {description && (
                            <p className="mt-1 text-sm text-slate-500">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Upload Area */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                            handleFileSelect(file);
                        }
                    }}
                    className={cn(
                        "relative flex min-h-[140px] w-full cursor-pointer",
                        "items-center justify-center",
                        "rounded-2xl",
                        "border border-dashed border-slate-200",
                        "bg-slate-50/50",
                        "px-5 py-6",
                        "transition-all duration-200",
                        "hover:border-[#837CC9]",
                        "hover:bg-white",
                        error && "border-red-500"
                    )}
                >
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        {/* Icon */}
                        <div
                            className=" flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5F3FF] text-[#40369F] "
                        >
                            <UploadCloud
                                className="h-8 w-8"
                                strokeWidth={1.6}
                            />
                        </div>

                        {/* Text */}
                        <div className="text-[15px] md:text-[18px]">
                            <span className="font-medium text-[#0F1219]">
                                افلت الملف هنا
                            </span>
                            <span className="px-2 text-[#676A6E]">
                                او
                            </span>
                            <span className="font-semibold text-[#0088FF]">
                                اختر من جهازك
                            </span>
                        </div>

                        <p className="text-xs text-[#9CA3AF]">
                            PDF فقط
                        </p>
                    </div>

                    <input
                        ref={fileInputRef}
                        id="attachments"
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                handleFileSelect(file);
                            }
                        }}
                    />
                </div>

                {/* Selected File */}
                {selectedFile && (
                    <div
                        className=" mt-4 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <div
                                className=" flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5F3FF] text-[#40369F]"
                            >
                                <FileText className="h-5 w-5" />
                            </div>

                            <span
                                className=" max-w-[200px] truncate text-sm font-medium text-[#232323] "
                            >
                                {selectedFile.name}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setSelectedFile(null);
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = "";
                                }
                            }}
                            className=" flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50 ">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {error && (
                    <p className="mt-2 text-sm font-medium text-red-500">
                        {error}
                    </p>
                )}
            </div>
        </Card>
    );
}
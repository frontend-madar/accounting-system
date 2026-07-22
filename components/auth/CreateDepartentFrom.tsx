"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2, Building2, Layers, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useCreateDepartments } from "@/hooks/use-department";

export function CreateDepartmentsForm() {
    const [departments, setDepartments] = useState<string[]>([""]);
    const [error, setError] = useState<string | null>(null);
    const [focusedField, setFocusedField] = useState<number | null>(null);
    const createDepartments = useCreateDepartments();

    function updateDepartment(index: number, value: string) {
        setDepartments((prev) => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
    }

    function addDepartmentField() {
        setDepartments((prev) => [...prev, ""]);
    }

    function removeDepartmentField(index: number) {
        setDepartments((prev) => prev.filter((_, i) => i !== index));
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const cleaned = departments.map((d) => d.trim()).filter(Boolean);

        if (cleaned.length === 0) {
            setError("يجب إضافة قسم واحد على الأقل");
            return;
        }

        setError(null);
        createDepartments.mutate({ departments: cleaned });
    }

    return (
        <div className="w-full md:p-6 flex flex-col justify-between min-h-screen md:min-h-auto">
            {/* Brand Header - Mobile */}
            <div className="md:hidden text-center pt-8 pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#40369F] to-[#322A7C] shadow-lg shadow-[#40369F]/25 mb-3">
                    <span className="text-2xl font-bold text-white">D</span>
                </div>
                <h1 className="text-2xl font-bold text-[#171A1F]">إنشاء الأقسام</h1>
                <p className="text-sm text-[#6C7075] mt-1">نظم هيكل شركتك</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-[#40369F]/5 border border-[#F0F0F2] p-6 md:p-10 transition-all hover:shadow-2xl hover:shadow-[#40369F]/8">
                {/* Desktop Header */}
                <div className="hidden md:block">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-[#40369F] to-[#322A7C]"></div>
                        <h1 className="text-[32px] font-bold text-[#171A1F]">إنشاء الأقسام</h1>
                    </div>
                    <p className="text-[16px] text-[#6C7075] pr-4 leading-relaxed">
                        قم بإضافة الأقسام الرئيسية في شركتك لتنظيم الموظفين والعمليات قبل البدء باستخدام النظام.
                    </p>
                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-[#F8F9FF] rounded-xl border border-[#EDEEFF]">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#40369F]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Layers className="h-4 w-4 text-[#40369F]" />
                        </div>
                        <div>
                            <p className="text-[14px] font-medium text-[#171A1F]">أضف الأقسام الرئيسية لشركتك</p>
                            <p className="text-[13px] text-[#6C7075] leading-relaxed">
                                يمكنك إضافة قسم واحد أو أكثر. سيتمكن الموظفون من الانضمام إلى هذه الأقسام بعد إنشاء حساباتهم.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                    {departments.map((department, index) => (
                        <div key={index} className="space-y-1.5 group">
                            <Label 
                                htmlFor={`department-${index}`} 
                                className="text-sm font-medium text-[#171A1F] flex items-center gap-2"
                            >
                                <span className="w-6 h-6 rounded-full bg-[#40369F]/10 flex items-center justify-center text-xs font-bold text-[#40369F]">
                                    {index + 1}
                                </span>
                                القسم {index + 1}
                            </Label>
                            <div className="flex items-center gap-2">
                                <div className={cn(
                                    "relative flex-1 rounded-xl transition-all duration-200",
                                    focusedField === index && "ring-2 ring-[#40369F]/20 shadow-lg shadow-[#40369F]/5"
                                )}>
                                    <Input
                                        id={`department-${index}`}
                                        name={`department-${index}`}
                                        type="text"
                                        placeholder="مثال: قسم الموارد البشرية"
                                        value={department}
                                        onChange={(e) => updateDepartment(index, e.target.value)}
                                        onFocus={() => setFocusedField(index)}
                                        onBlur={() => setFocusedField(null)}
                                        className={cn(
                                            "ctm-inp h-[54px] text-[15px] rounded-xl border-[#E4E5E7] bg-[#FAFBFC] transition-all duration-200",
                                            "placeholder:text-[#9A9DA2] placeholder:text-sm",
                                            "focus:bg-white focus:border-[#40369F]",
                                            focusedField === index && "border-[#40369F]"
                                        )}
                                    />
                                    <Building2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9A9DA2] pointer-events-none transition-colors duration-200" />
                                </div>
                                {departments.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeDepartmentField(index)}
                                        aria-label="حذف القسم"
                                        className="h-[54px] w-[54px] rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 flex-shrink-0 group/delete"
                                    >
                                        <Trash2 className="h-5 w-5 text-[#9A9DA2] group-hover/delete:text-red-500 transition-colors duration-200" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}

                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl animate-in fade-in slide-in-from-top-1 duration-200">
                            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={addDepartmentField}
                            className="flex items-center justify-center gap-2 h-[50px] rounded-xl border-[#E4E5E7] hover:border-[#40369F] hover:bg-[#F8F9FF] hover:text-[#40369F] transition-all duration-200 group"
                        >
                            <Plus className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                            إضافة قسم آخر
                        </Button>

                        <Button
                            type="submit"
                            disabled={createDepartments.isPending}
                            className={cn(
                                "bg-gradient-to-r from-[#40369F] to-[#322A7C] h-[50px] text-[16px] font-semibold hover:from-[#322A7C] hover:to-[#2A226B] focus-visible:ring-4 focus-visible:ring-[#40369F]/30 flex items-center justify-center gap-3 transition-all duration-300 rounded-xl shadow-lg shadow-[#40369F]/25 hover:shadow-xl hover:shadow-[#40369F]/35 hover:scale-[1.01] active:scale-[0.98] group"
                            )}
                        >
                            {createDepartments.isPending ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    جارِ الإضافة...
                                </>
                            ) : (
                                <>
                                    إنشاء الأقسام
                                    <Building2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Department Count */}
                    {departments.length > 0 && (
                        <div className="flex items-center justify-center gap-2 pt-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#40369F]"></div>
                            <p className="text-xs text-[#8B8E92]">
                                عدد الأقسام المضافة: <span className="font-semibold text-[#171A1F]">{departments.filter(d => d.trim()).length}</span>
                            </p>
                        </div>
                    )}
                </form>
            </div>

            {/* Footer Terms */}
            <div className="text-center text-[12px] text-[#8B8E92] mt-6 leading-relaxed px-4">
                بإنشاء حسابك، أنت توافق على{" "}
                <span className="font-semibold text-[#5C5F63] hover:text-[#40369F] transition-colors duration-200 cursor-pointer">
                    شروط الاستخدام
                </span>
                {" و "}
                <span className="font-semibold text-[#5C5F63] hover:text-[#40369F] transition-colors duration-200 cursor-pointer">
                    سياسة الخصوصية
                </span>
                {" "} الخاصة بالنظام.
            </div>
        </div>
    );
}
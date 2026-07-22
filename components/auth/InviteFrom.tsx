"use client";

import { useState } from "react";
import { Copy, Check, X, Mail, Send, Users, Link2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { inviteAccountantSchema } from "@/validations/auth";
import { z } from "zod";
import { useInviteAccountant } from "@/hooks/use-auth";
import MainButton from "../dashboard/MainButton";
import { toast } from "sonner";

type InviteAccountantFormValues = z.infer<typeof inviteAccountantSchema>;
type FieldErrors = Partial<Record<keyof InviteAccountantFormValues, string>>;

interface InviteFromProps {
    onClose?: () => void;
}

export function InviteFrom({ onClose }: InviteFromProps) {
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [justCopied, setJustCopied] = useState(false);
    const inviteMutation = useInviteAccountant();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const raw = {
            email: String(formData.get("email") ?? ""),
        };

        const result = inviteAccountantSchema.safeParse(raw);
        if (!result.success) {
            const errors: FieldErrors = {};
            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof InviteAccountantFormValues;
                if (!errors[key]) errors[key] = issue.message;
            }
            setFieldErrors(errors);
            return;
        }

        setFieldErrors({});
        inviteMutation.mutate(result.data, {
            onSuccess: () => {
                toast.success("تم إرسال الدعوة بنجاح");
                onClose?.();
            },
        });
    }

    function handleCopyLink() {
        const link = inviteMutation.data?.data.invitationLink;
        if (!link) {
            toast.error("لا يوجد رابط لنسخه — أرسل الدعوة أولاً");
            return;
        }
        navigator.clipboard.writeText(link);
        toast.success("تم نسخ رابط الدعوة");
        setJustCopied(true);
        setTimeout(() => setJustCopied(false), 2000);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                <div className="bg-white rounded-3xl shadow-2xl shadow-[#40369F]/10 p-6 md:p-8 relative border border-[#F0F0F2]">
                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="إغلاق"
                        className="absolute left-4 top-4 w-10 h-10 rounded-full flex items-center justify-center text-[#8B8E92] hover:text-[#171A1F] hover:bg-[#F5F5F7] transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-1 pr-8">
                        <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-[#40369F] to-[#322A7C]"></div>
                        <h1 className="text-[22px] md:text-[26px] font-bold text-[#171A1F]">
                            دعوة محاسب جديد
                        </h1>
                    </div>
                    <p className="text-[14px] md:text-[15px] text-[#6C7075] pr-4 leading-relaxed">
                        أرسل دعوة عبر البريد الإلكتروني لإضافة محاسب إلى حسابك
                    </p>

                    <Separator className="mt-5 bg-[#F0F0F2]" />

                    <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-sm font-medium text-[#171A1F] flex items-center gap-2">
                                <Mail className="h-4 w-4 text-[#40369F]" />
                                البريد الإلكتروني
                            </Label>
                            <div className={cn(
                                "relative rounded-xl transition-all duration-200",
                                focusedField === "email" && "ring-2 ring-[#40369F]/20 shadow-lg shadow-[#40369F]/5"
                            )}>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="accountant@company.com"
                                    autoComplete="email"
                                    dir="ltr"
                                    aria-invalid={!!fieldErrors.email}
                                    onFocus={() => setFocusedField("email")}
                                    onBlur={() => setFocusedField(null)}
                                    className={cn(
                                        "ctm-inp pr-11 h-[54px] text-[15px] rounded-xl border-[#E4E5E7] bg-[#FAFBFC] transition-all duration-200",
                                        "placeholder:text-[#9A9DA2] placeholder:text-sm",
                                        "focus:bg-white focus:border-[#40369F]",
                                        fieldErrors.email &&
                                            "border-red-500 focus-visible:ring-red-500 bg-red-50/40",
                                        !fieldErrors.email && focusedField === "email" && "border-[#40369F]"
                                    )}
                                />
                                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9A9DA2] pointer-events-none transition-colors duration-200" />
                                {fieldErrors.email && (
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                                    </div>
                                )}
                            </div>
                            {fieldErrors.email && (
                                <p className="text-sm text-red-600 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                                    {fieldErrors.email}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
                            {/* Copy Link Button */}
                            <button
                                type="button"
                                onClick={handleCopyLink}
                                className="flex items-center gap-2 text-[#40369F] hover:text-[#322A7C] text-[14px] font-medium transition-all duration-200 group w-full sm:w-auto justify-center sm:justify-start"
                            >
                                <div className="w-9 h-9 rounded-full bg-[#F5F6FF] flex items-center justify-center group-hover:bg-[#EDEEFF] transition-colors duration-200">
                                    {justCopied ? (
                                        <Check className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <Copy className="h-4 w-4 text-[#40369F]" />
                                    )}
                                </div>
                                <span>
                                    {justCopied ? "تم النسخ" : "نسخ رابط الدعوة"}
                                </span>
                            </button>

                            {/* Submit Button */}
                            <MainButton
                                text="ارسال الدعوة"
                                icon={<Send className="h-4 w-4" />}
                                disabled={inviteMutation.isPending}
                                className="w-full sm:!w-auto sm:min-w-[160px] bg-gradient-to-r from-[#40369F] to-[#322A7C] hover:from-[#322A7C] hover:to-[#2A226B] shadow-lg shadow-[#40369F]/25 hover:shadow-xl hover:shadow-[#40369F]/35 transition-all duration-300 rounded-xl h-[50px] text-[16px] font-semibold"
                            />
                        </div>

                        {/* Info Message */}
                        <div className="flex items-start gap-2 pt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#40369F] mt-2"></div>
                            <p className="text-xs text-[#8B8E92] leading-relaxed">
                                سيتم إرسال دعوة إلى البريد الإلكتروني المحدد. يمكنك نسخ الرابط ومشاركته يدويًا أيضًا.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
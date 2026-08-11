"use client";

import { Loader2, Mail, Send, X, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MainButton from "@/components/dashboard/shared/MainButton";
import SecondaryButton from "@/components/dashboard/shared/SecondaryButton";
import { useEffect, useRef, useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface EmailPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (email: string) => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  placeholder?: string;
  suggestedEmails?: string[];
  showRecentEmails?: boolean;
  recentEmails?: string[];
}

export function EmailPromptDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  title = "إرسال بالبريد الإلكتروني",
  description = "أدخل البريد الإلكتروني الذي تريد إرسال الملف إليه.",
  confirmLabel = "إرسال",
  cancelLabel = "إلغاء",
  placeholder = "example@company.com",
  suggestedEmails = [],
  showRecentEmails = false,
  recentEmails = [],
}: EmailPromptDialogProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setEmail("");
      setError(null);
      setShowSuggestions(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".suggestions-container")) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError("البريد الإلكتروني مطلوب");
      return;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setError("صيغة البريد الإلكتروني غير صحيحة");
      return;
    }
    setError(null);
    onSubmit(trimmed);
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    if (error) setError(null);
    setShowSuggestions(value.includes("@") && !value.includes(" "));
  }

  function handleDomainSuggestion(domain: string) {
    const localPart = email.split("@")[0];
    setEmail(localPart ? `${localPart}@${domain}` : `@${domain}`);
    setShowSuggestions(false);
    inputRef.current?.focus();
  }

  function handleRecentEmail(recent: string) {
    setEmail(recent);
    setShowSuggestions(false);
    onSubmit(recent);
  }

  const emailStatus = !email
    ? null
    : EMAIL_REGEX.test(email)
    ? { icon: CheckCircle2, color: "text-green-500" }
    : { icon: AlertCircle, color: "text-red-500" };

  return (
    <Dialog open={open} onOpenChange={(next) => !isLoading && onOpenChange(next)}>
      <DialogContent
        dir="rtl"
        className="sm:max-w-[480px] w-[calc(100%-2rem)] rounded-2xl shadow-2xl border-0 overflow-hidden p-0"
      >
        {/* Gradient Header */}
        <div className="relative bg-gradient-to-r from-primary/5 via-primary/10 to-transparent px-6 pt-6 pb-4">
          <DialogHeader>
            {/* min-w-0 lets the text block shrink instead of pushing the close button out of view */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-12 w-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-[20px] font-bold text-[#171A1F] truncate">
                    {title}
                  </DialogTitle>
                  <DialogDescription className="text-[14px] text-[#6C7075] mt-0.5">
                    {description}
                  </DialogDescription>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full hover:bg-muted"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6 pt-4">
          <div className="relative space-y-2">
            <Label
              htmlFor="export-email"
              className="text-sm font-medium text-[#171A1F] flex items-center gap-2"
            >
               البريد الإلكتروني
            </Label>

            <div className="relative">
              <Input
                ref={inputRef}
                id="export-email"
                type="email"
                autoFocus
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  setIsFocused(false);
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                placeholder={placeholder}
                disabled={isLoading}
                aria-invalid={!!error}
                className={cn(
                  "h-[52px] w-full text-[15px] rounded-xl border-[#E4E5E7] bg-[#FAFBFC]",
                  // pr for the static mail icon, pl reserved for the status icon so text never collides with either
                  "pr-11 pl-11",
                  "placeholder:text-[#9A9DA2] placeholder:text-sm",
                  "transition-all duration-200",
                  "focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20",
                  "hover:border-primary/50",
                  error && "border-red-500 focus-visible:ring-red-500 bg-red-50/40",
                  emailStatus && emailStatus.color.includes("green") && "border-green-500 bg-green-50/40",
                  isFocused && "shadow-lg shadow-primary/5"
                )}
              />

              {email && emailStatus && (
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <emailStatus.icon className={cn("h-5 w-5", emailStatus.color)} />
                </div>
              )}

              <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9A9DA2] pointer-events-none" />
            </div>

            {error && (
              <p className="text-sm text-red-600 flex items-center gap-2 animate-in slide-in-from-top-1 duration-200">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </p>
            )}

           
          </div>

          {showRecentEmails && recentEmails.length > 0 && !email && (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">البريد الإلكتروني المستخدم مؤخراً</Label>
              <div className="flex flex-wrap gap-2">
                {recentEmails.map((recentEmail, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs rounded-lg border-gray-200 hover:border-primary hover:bg-primary/5 gap-1.5"
                    onClick={() => handleRecentEmail(recentEmail)}
                  >
                    <Mail className="h-3 w-3" />
                    {recentEmail}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {suggestedEmails.length > 0 && !email && (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">اقتراحات</Label>
              <div className="flex flex-wrap gap-2">
                {suggestedEmails.map((suggestedEmail, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs rounded-lg border-primary/20 hover:border-primary hover:bg-primary/5 gap-1.5"
                    onClick={() => handleRecentEmail(suggestedEmail)}
                  >
                    <Mail className="h-3 w-3 text-primary" />
                    {suggestedEmail}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-2 border-t border-gray-100">
            {/* w-auto AND md:w-auto — the internal SecondaryButton/MainButton set md:w-[246px],
                so the override must repeat at the same breakpoint or it's ignored on desktop */}
            <SecondaryButton
              type="button"
              text={cancelLabel}
              className="w-auto md:w-auto !min-w-0 shrink-0 px-5 h-11"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            />
            <MainButton
              type="submit"
              text={confirmLabel}
              className="w-auto md:w-auto !min-w-0 shrink-0 px-6 h-11 gap-2"
              disabled={isLoading || !email || !!error}
              icon={isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            />
          </DialogFooter>
        </form>

        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-2xl">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium text-muted-foreground">جاري إرسال البريد الإلكتروني...</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
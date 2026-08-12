"use client";

import * as React from "react";
import { Download, FileText, FileSpreadsheet, Mail, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SecondaryButton from "./SecondaryButton";
import { EmailPromptDialog } from "./mailPromptDialog";

interface ExportDropdownProps {
  label?: string;
  className?: string;
  isExportingPdf?: boolean;
  isExportingExcel?: boolean;
  isExportingEmail?: boolean;
  onExportPdf: () => void;
  onExportExcel: () => void;
  onExportEmail: (email: string) => void;
}

export function ExportDropdown({
  label = "تصدير",
  className = "sm:!w-[111px] w-full",
  isExportingPdf = false,
  isExportingExcel = false,
  isExportingEmail = false,
  onExportPdf,
  onExportExcel,
  onExportEmail,
}: ExportDropdownProps) {
  const [emailDialogOpen, setEmailDialogOpen] = React.useState(false);

  const isExporting = isExportingPdf || isExportingExcel || isExportingEmail;

  function handleEmailSubmit(email: string) {
    onExportEmail(email);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={isExporting}
          render={
            <SecondaryButton
              text={label}
              icon={
                isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )
              }
              className={className}
              disabled={isExporting}
            />
          }
        />
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={onExportPdf}
            disabled={isExporting}
            className="gap-2 cursor-pointer"
          >
            <FileText className="h-4 w-4 text-[#6C7075]" />
            تصدير PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onExportExcel}
            disabled={isExporting}
            className="gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4 text-[#6C7075]" />
            تصدير Excel
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setEmailDialogOpen(true)}
            disabled={isExporting}
            className="gap-2 cursor-pointer"
          >
            <Mail className="h-4 w-4 text-[#6C7075]" />
            إرسال بالبريد الإلكتروني
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EmailPromptDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        onSubmit={handleEmailSubmit}
        isLoading={isExportingEmail}
        title="إرسال بالبريد الإلكتروني"
        description="أدخل البريد الإلكتروني الذي تريد إرسال ملف الموردين إليه."
        confirmLabel="إرسال"
      />
    </>
  );
}
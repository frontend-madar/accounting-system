"use client";

import * as React from "react";
import { useRef, useState } from "react";
import { Upload, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface SingleAttachmentDropzoneProps {
  title?: string;
  subtitle?: string;
  onFileSelect: (file: File) => void;
  className?: string;
}

export function SingleAttachmentDropzone({
  title = "إرفاق مستند",
  subtitle = "قم بإرفاق المستندات المرتبطة بالمصروف",
  onFileSelect,
  className,
}: SingleAttachmentDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  function handleFile(file: File) {
    setFileName(file.name);
    onFileSelect(file);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
      }}
      className={cn(
        "group flex  h-full  w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D8D2F6] bg-[#FCFCFE] px-6 py-8 text-center",
        "transition-colors duration-200",
        "hover:border-[#463BAF] hover:bg-[#FAF9FF]",
        className
      )}
    >
      {/* Upload Icon */}
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#F5F3FF]">
        <Upload
          className="h-10 w-10 text-[#463BAF]"
          strokeWidth={2}
        />
      </div>

      {/* Title */}
      <h3 className="text-[20px] font-bold text-[#1F2937]">
        {fileName ? "تم اختيار الملف" : title}
      </h3>

      {/* Subtitle / File */}
      {fileName ? (
        <div className="mt-4 flex max-w-full items-center gap-2 rounded-xl bg-[#F5F3FF] px-4 py-2">
          <FileText className="h-5 w-5 shrink-0 text-[#463BAF]" />

          <span className="max-w-[240px] truncate text-[14px] font-medium text-[#463BAF]">
            {fileName}
          </span>
        </div>
      ) : (
        <>
          <p className="mt-2 max-w-[320px] text-[15px] leading-7 text-[#6B7280]">
            {subtitle}
          </p>

          <span className="mt-5 rounded-lg bg-[#463BAF] px-5 py-2 text-[14px] font-semibold text-white">
            اختر ملف
          </span>

         
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
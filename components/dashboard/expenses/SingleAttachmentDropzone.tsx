"use client";

import * as React from "react";
import { useRef, useState } from "react";
import { Upload } from "lucide-react";
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
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
      }}
      className={cn(
        "flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#D8D6E5] bg-[#FAFCFE] px-4 py-6 text-center cursor-pointer transition-colors hover:bg-[#F5F4FB]",
        className
      )}
    >

      <svg width="47" height="56" viewBox="0 0 47 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.6667 41.975H30C31.8333 41.975 33.3333 40.475 33.3333 38.6417V21.975H38.6333C41.6 21.975 43.1 18.375 41 16.275L25.7 0.975C24.4 -0.325 22.3 -0.325 21 0.975L5.7 16.275C3.6 18.375 5.06667 21.975 8.03333 21.975H13.3333V38.6417C13.3333 40.475 14.8333 41.975 16.6667 41.975ZM3.33333 48.6417H43.3333C45.1667 48.6417 46.6667 50.1417 46.6667 51.975C46.6667 53.8083 45.1667 55.3083 43.3333 55.3083H3.33333C1.5 55.3083 0 53.8083 0 51.975C0 50.1417 1.5 48.6417 3.33333 48.6417Z" fill="#463BAF" />
      </svg>

      <p className="text-[18px] font-bold text-[#463BAF]">
        {fileName ?? title}
      </p>
      {!fileName && (
        <p className="text-[13px] font-medium text-[#3C3F45]">{subtitle}</p>
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
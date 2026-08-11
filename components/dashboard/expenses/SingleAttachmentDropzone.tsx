"use client";

import { useRef, useState, useEffect } from "react";
import { Upload, FileText, X, Paperclip, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface SingleAttachmentDropzoneProps {
    title?: string;
    subtitle?: string;
    onFileSelect: (file: File | null) => void;
    className?: string;
    initialFileUrl?: string;
    initialFileName?: string;
    acceptedFileTypes?: string;
    maxFileSize?: number; // in MB
}

export function SingleAttachmentDropzone({
    title = "إرفاق مستند",
    subtitle = "قم بإرفاق المستندات المرتبطة بالمصروف",
    onFileSelect,
    className,
    initialFileUrl,
    initialFileName,
    acceptedFileTypes = "image/*,.pdf,.doc,.docx",
    maxFileSize = 5, // 5MB default
}: SingleAttachmentDropzoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | null>(initialFileName || null);
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialFileUrl || null);
    const [isHovering, setIsHovering] = useState(false);

    // Clean up preview URL on unmount
    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    function handleFile(file: File) {
        // Validate file size
        if (file.size > maxFileSize * 1024 * 1024) {
            toast.error(`حجم الملف يتجاوز الحد الأقصى (${maxFileSize}MB)`);
            return;
        }

        setFile(file);
        setFileName(file.name);
        
        // Create preview URL for images
        if (file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
        
        onFileSelect(file);
    }

    function handleRemoveFile() {
        setFile(null);
        setFileName(null);
        setPreviewUrl(initialFileUrl || null);
        onFileSelect(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            handleFile(droppedFile);
        }
    }

    function handleDragOver(e: React.DragEvent) {
        e.preventDefault();
        setIsDragging(true);
    }

    function handleDragLeave(e: React.DragEvent) {
        e.preventDefault();
        setIsDragging(false);
    }

    function getFileIcon() {
        if (!fileName) return <Upload className="h-10 w-10 text-[#463BAF]" />;
        
        const extension = fileName.split(".").pop()?.toLowerCase();
        if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")) {
            return <Image className="h-8 w-8 text-[#463BAF]" />;
        }
        return <FileText className="h-8 w-8 text-[#463BAF]" />;
    }

    function getFileTypeBadge() {
        if (!fileName) return null;
        
        const extension = fileName.split(".").pop()?.toUpperCase() || "";
        const typeMap: Record<string, { label: string; variant: string }> = {
            PDF: { label: "PDF", variant: "bg-red-100 text-red-700" },
            DOC: { label: "DOC", variant: "bg-blue-100 text-blue-700" },
            DOCX: { label: "DOCX", variant: "bg-blue-100 text-blue-700" },
            JPG: { label: "JPG", variant: "bg-green-100 text-green-700" },
            JPEG: { label: "JPEG", variant: "bg-green-100 text-green-700" },
            PNG: { label: "PNG", variant: "bg-green-100 text-green-700" },
            GIF: { label: "GIF", variant: "bg-purple-100 text-purple-700" },
        };

        const fileType = typeMap[extension];
        if (!fileType) return null;

        return (
            <div className={`${fileType.variant} border-0`}>
                {fileType.label}
            </div>
        );
    }

    // Show existing file if available and no new file has been selected
    if (initialFileUrl && !file && !fileName) {
        return (
            <Card 
                className={cn(
                    "relative flex flex-col items-center justify-center p-6 border-2 border-dashed transition-all duration-200",
                    "hover:border-[#463BAF] hover:bg-[#FAF9FF]",
                    className
                )}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="rounded-full bg-[#F5F3FF] p-4">
                        <Paperclip className="h-8 w-8 text-[#463BAF]" />
                    </div>
                    <div>
                        <p className="font-medium text-[#1F2937]">
                            {initialFileName || "المرفق الحالي"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            ملف مرفق موجود
                        </p>
                    </div>
                    
                    {isHovering && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-lg">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setPreviewUrl(null);
                                    setFileName(null);
                                }}
                                className="bg-white"
                            >
                                <Upload className="h-4 w-4 ml-2" />
                                استبدال الملف
                            </Button>
                        </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="link"
                            size="sm"
                            className="text-[#463BAF]"
                            onClick={() => window.open(initialFileUrl, "_blank")}
                        >
                            عرض المرفق
                        </Button>
                    </div>
                </div>
            </Card>
        );
    }

    // Show uploaded file preview
    if (file || fileName) {
        const isImage = previewUrl?.startsWith("blob:") && file?.type?.startsWith("image/");
        
        return (
            <Card className={cn(
                "p-4 border-2 border-solid transition-all",
                isDragging ? "border-[#463BAF] bg-[#FAF9FF]" : "border-gray-200",
                className
            )}>
                <div className="flex items-start gap-4">
                    {/* File Preview */}
                    {isImage && previewUrl ? (
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 border">
                            <img
                                src={previewUrl}
                                alt={fileName || "Preview"}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#F5F3FF] flex-shrink-0">
                            {getFileIcon()}
                        </div>
                    )}

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="font-medium text-[#1F2937] truncate">
                                {fileName}
                            </p>
                            {getFileTypeBadge()}
                        </div>
                        {file && (
                            <p className="text-sm text-muted-foreground">
                                {(file.size / 1024).toFixed(1)} KB
                            </p>
                        )}
                        {!file && initialFileName && (
                            <p className="text-sm text-muted-foreground">ملف مرفق موجود</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {isImage && previewUrl && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => window.open(previewUrl, "_blank")}
                            >
                                <FileText className="h-4 w-4" />
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={handleRemoveFile}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        );
    }

    // Default dropzone
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
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
                "group flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200",
                isDragging
                    ? "border-[#463BAF] bg-[#FAF9FF]"
                    : "border-[#D8D2F6] bg-[#FCFCFE] hover:border-[#463BAF] hover:bg-[#FAF9FF]",
                className
            )}
        >
            {/* Upload Icon */}
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#F5F3FF] transition-all duration-200 group-hover:bg-[#463BAF]/10">
                <Upload
                    className="h-10 w-10 text-[#463BAF] transition-all duration-200 group-hover:scale-110"
                    strokeWidth={2}
                />
            </div>

            {/* Title */}
            <h3 className="text-[20px] font-bold text-[#1F2937]">
                {title}
            </h3>

            {/* Subtitle */}
            <p className="mt-2 max-w-[320px] text-[15px] leading-7 text-[#6B7280]">
                {subtitle}
            </p>

            {/* Accepted file types info */}
            <p className="mt-1 text-xs text-muted-foreground">
                الحد الأقصى للحجم: {maxFileSize}MB | الصيغ المدعومة: {acceptedFileTypes.replace(/\./g, "").toUpperCase()}
            </p>

            {/* Action Buttons */}
            <div className="mt-5 flex items-center gap-3">
                <Button
                    type="button"
                    className="bg-[#463BAF] hover:bg-[#463BAF]/90 text-white"
                    onClick={(e) => {
                        e.stopPropagation();
                        inputRef.current?.click();
                    }}
                >
                    <Upload className="ml-2 h-4 w-4" />
                    اختر ملف
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                        e.stopPropagation();
                        // Open file picker with acceptance filter
                        if (inputRef.current) {
                            inputRef.current.accept = acceptedFileTypes;
                            inputRef.current.click();
                        }
                    }}
                >
                    تصفح
                </Button>
            </div>

            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept={acceptedFileTypes}
                onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                        handleFile(selectedFile);
                    }
                }}
            />
        </div>
    );
}
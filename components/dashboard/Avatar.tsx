"use client";

import * as React from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";

function Avatar({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="avatar"
            className={cn(
                "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
                className
            )}
            {...props}
        />
    );
}

function AvatarImage({
    className,
    onError,
    ...props
}: React.ComponentProps<"img">) {
    const [failed, setFailed] = useState(false);

    if (failed) return null;

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            data-slot="avatar-image"
            className={cn("aspect-square h-full w-full object-cover", className)}
            onError={(event) => {
                setFailed(true);
                onError?.(event);
            }}
            {...props}
        />
    );
}

function AvatarFallback({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="avatar-fallback"
            className={cn(
                "flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground",
                className
            )}
            {...props}
        />
    );
}

export { Avatar, AvatarImage, AvatarFallback };
import Sidebar from "@/components/dashboard/Sidebar";
import * as React from "react";


export default function DashboardLayout({ children, }: { children: React.ReactNode}) {
    return (
        <div className="flex h-screen w-full overflow-hidden p-4">
            <Sidebar />
            <section className="flex-1 overflow-y-auto custom-scrollbar">{children}</section>
        </div>
    );
}
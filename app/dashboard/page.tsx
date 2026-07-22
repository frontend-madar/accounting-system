import { FinanceChartCard } from "@/components/dashboard/FinanceChartCard";
import { Invoice } from "@/components/dashboard/InvoicesColumns";
import { InvoicesStatusCard } from "@/components/dashboard/InvoicesStatusCard";
import { InvoicesTableSection } from "@/components/dashboard/InvoicesTableSection";
import { NavCard } from "@/components/dashboard/NavCard";
import { Topbar } from "@/components/dashboard/Topbar";
import { CirclePlus, ChevronLeft } from "lucide-react";



// Sample data — swap for a real fetch (server component, route handler, etc).
const INVOICES: Invoice[] = Array.from({ length: 45 }, (_, i) => ({
    id: `inv-${i + 1}`,
    employee: "الاء",
    client: "محمد العنزي",
    amount: 5064,
    travelDate: "15/6/2026",
    paid: 5064,
    paymentMethod: "الراجحي",
    paymentDate: "15/6/2026",
    remaining: i % 5 === 2 ? 1064 : 0,
    status: i % 5 === 2 ? "partial" : i % 5 === 4 ? "cancelled" : "completed",
}));


export default function DashboardOverviewPage() {
    return (
        <div className="space-y-4 px-4">
            <Topbar title="نظرة شاملة على العمليات المالية" userName="mohamed ali" />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <NavCard
                    href="/dashboard/invoices/create"
                    title="إنشاء فاتورة"
                    icon={<CirclePlus className="h-5 w-5 text-[#463BAF]" />}
                />

                <NavCard
                    href="/dashboard/clients/create"
                    title="اضافة عملاء"
                    icon={<CirclePlus className="h-5 w-5 text-[#463BAF]" />}
                />

                <NavCard
                    href="/dashboard/invoices"
                    title="الفواتير"
                    subtitle="عرض جميع الفواتير"
                    icon={<ChevronLeft className="h-5 w-5 text-[#161616]" />}
                />

                <NavCard
                    href="/dashboard/invoices"
                    title="العملاء"
                    subtitle="عرض جميع العملاء"
                    icon={<ChevronLeft className="h-5 w-5 text-[#161616]" />}
                />

            </div>

            <div className="rounded-2xl ctm-shadow bg-white p-5">
                <InvoicesTableSection data={INVOICES} />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <FinanceChartCard />
                <InvoicesStatusCard />
            </div>
        </div>
    );
}
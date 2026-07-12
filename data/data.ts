export interface InvoiceListItem {
    id: string;
    invoiceNumber: string;
    employeeName: string;
    employeeAvatarSrc?: string;
    clientName: string;
    clientId: string;
    createdDate: string;
    remaining: number;
    status: string;
}

export const SAMPLE_INVOICES: InvoiceListItem[] = [
    {
        id: "1",
        invoiceNumber: "193543",
        employeeName: "سيف",
        clientName: "محمود صلاح ماجد",
        clientId: "101325",
        createdDate: "15/6/2026",
        remaining: 6532,
        status: "مستحقة الدفع",
    },
    {
        id: "2",
        invoiceNumber: "193543",
        employeeName: "شريف",
        clientName: "عمر محمد ناصر",
        clientId: "101325",
        createdDate: "15/6/2026",
        remaining: 6532,
        status: "مستحقة الدفع",
    },
    {
        id: "3",
        invoiceNumber: "193543",
        employeeName: "أحمد",
        clientName: "ماجد غنيم احمد",
        clientId: "101325",
        createdDate: "15/6/2026",
        remaining: 6532,
        status: "مستحقة الدفع",
    },
    {
        id: "4",
        invoiceNumber: "193543",
        employeeName: "أحمد",
        clientName: "ماجد غنيم احمد",
        clientId: "101325",
        createdDate: "15/6/2026",
        remaining: 6532,
        status: "مستحقة الدفع",
    },
];
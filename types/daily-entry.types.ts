export interface DailyEntryBookingLine {
    id: string;
    dailyEntryId: string;
    bookingPlace: string;
    serviceType: string;
    bookingPrice: number;
    createdAt: string;
    updatedAt: string;
}

export interface DailyEntryItem {
    id: string;
    clientId: string;
    clientName: string;
    clientNumber: string;
    employeeId: string;
    employeeName: string;
    checkIn: string;
    checkOut: string;
    destination: string;
    totalCost: number;
    paidAmount: number;
    remainingAmount: number;
    paymentDate: string;
    paymentMethod: string;
    currency: string;
    createdAt: string;
    updatedAt: string;
    bookingLines: DailyEntryBookingLine[];
}

export interface GetDailyEntriesParams {
    search?: string;
    page?: number;
    limit?: number;
}

export interface DailyEntriesPaginatedData {
    data: DailyEntryItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface GetDailyEntriesResponse {
    success: boolean;
    data: DailyEntriesPaginatedData;
    message?: string;
}

export interface GetDailyEntryResponse {
    success: boolean;
    data: DailyEntryItem;
    message?: string;
}

export interface CreateDailyEntryBookingLinePayload {
    bookingPlace: string;
    serviceType: string;
    bookingPrice: number;
}

export interface CreateDailyEntryPayload {
    clientName: string;
    employeeName: string;
    checkIn: string;
    checkOut: string;
    currency: string;
    destination: string;
    totalCost: number;
    paidAmount: number;
    paymentDate: string;
    paymentMethod: string;
    bookingLines: CreateDailyEntryBookingLinePayload[];
}

export interface CreateDailyEntryResponse {
    success: boolean;
    message: string;
    data: DailyEntryItem;
}

export interface UpdateDailyEntryPayload {
    clientName?: string;
    employeeName?: string;
    checkIn?: string;
    checkOut?: string;
    currency?: string;
    destination?: string;
    totalCost?: number;
    paidAmount?: number;
    paymentDate?: string;
    paymentMethod?: string;
    bookingLines?: CreateDailyEntryBookingLinePayload[];
}

export interface UpdateDailyEntryResponse {
    success: boolean;
    message: string;
    data: DailyEntryItem;
}

export interface DeleteDailyEntryResponse {
    success: boolean;
    message: string;
}


export interface AccountantData {
    id: string;
    name: string;
    email: string;
    role: string;
    status: "active" | "inactive";
    joinDate: string;
    avatar?: string;
}

export interface GetAccountsData {
    data: AccountantData[];
    totalAccountants: number;
    pendingInvitations: number;
}

export interface GetAccountsResponse {
    success: boolean;
    data: GetAccountsData;
    message: string;
}

export interface DeleteAccountResponse {
    success: boolean;
    message: string;
}
"use client";

import { CreateCustomerForm } from "@/components/dashboard/clients/CreateCustomerForm";
import { Topbar } from "@/components/dashboard/Topbar";


export default function CreateCustomerPage() {


    return (
        <div className="px-4 space-y-5">
            <Topbar title="العملاء " />
            <CreateCustomerForm/>
        </div>
    );
}
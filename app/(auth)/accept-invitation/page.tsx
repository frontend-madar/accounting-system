import { Suspense } from "react";
import { AcceptInvitationForm } from "@/components/auth/AcceptInvitationForm";

const page = () => {
  return (
    <Suspense>
      <AcceptInvitationForm />
    </Suspense>
  );
};

export default page;
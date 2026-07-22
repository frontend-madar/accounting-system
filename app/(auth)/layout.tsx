import { AuthHero } from "@/components/auth/AuthHero";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
   
      <div className="grid w-full min-h-screen overflow-hidden gap-10 p-5 lg:grid-cols-2">

          <AuthHero />
          {children}

    </div>
  );
}
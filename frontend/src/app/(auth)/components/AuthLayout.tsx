"use client";

import { ReactNode } from "react";

type AuthLayoutProps = {
  left: ReactNode;
  children: ReactNode;
};

export default function AuthLayout({ left, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-[#1a365d] via-[#2d4a7c] to-[#1a365d] p-12 lg:flex lg:w-1/2">
        {left}
      </div>

      <div className="flex flex-1">{children}</div>
    </div>
  );
}

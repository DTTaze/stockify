import "@/styles/index.css";

import { Geist } from "next/font/google";
import { Toaster } from "sonner";

import { cn } from "@/lib/utils";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

import "@/styles/index.css";

import { Metadata } from "next";
import { Geist } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "sonner";

import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (locale === "vi") {
    return {
      title: "Stockify - Dragon Predict | Hệ thống dự đoán cổ phiếu AI",
      description:
        "Hệ thống học máy LSTM tiên tiến giúp dự báo xu hướng và giá cổ phiếu tại Việt Nam. Phân tích kỹ thuật chuyên sâu, biểu đồ thời gian thực và quản lý danh mục đầu tư thông minh.",
      keywords: [
        "Stockify",
        "Dragon Predict",
        "dự báo cổ phiếu AI",
        "chứng khoán Việt Nam",
        "LSTM học máy",
        "phân tích kỹ thuật",
      ],
      icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.png",
        apple: "/logo.png",
      },
    };
  }

  return {
    title: "Stockify - Dragon Predict | AI Stock Prediction System",
    description:
      "Advanced LSTM machine learning system to predict stock trends and prices in Vietnam. Comprehensive technical analysis, real-time charts, and smart watchlist management.",
    keywords: [
      "Stockify",
      "Dragon Predict",
      "AI stock prediction",
      "Vietnam stock market",
      "LSTM machine learning",
      "technical analysis",
    ],
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.png",
      apple: "/logo.png",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={cn("font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body>
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider messages={messages} locale={locale}>
              <LanguageProvider>{children}</LanguageProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
        </ReactQueryProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

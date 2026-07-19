import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { jetbrainsMono } from "./fonts";

export const metadata: Metadata = {
  title: "Frontend Mentor | FX Checker",
  description: "Frontend Mentor | FX Checker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full overflow-x-hidden `}>
      <body
        className={` ${jetbrainsMono.className} bg-[#171717] min-h-full flex  w-full flex-col`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

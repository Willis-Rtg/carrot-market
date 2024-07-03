import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Dokdo } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/top-bar";

const inter = Inter({ subsets: ["latin"] });
const dokdo = Dokdo({
  weight: ["400"],
  style: ["normal"],
  variable: "--dokdo-text",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Karrot Market",
    default: "Karrot Market",
  },
  description: "Sell and buy all the things!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${dokdo} bg-neutral-900 text-white max-w-screen-sm mx-auto`}
        suppressHydrationWarning={true}
      >
        <TopBar />
        <div className="py-9"></div>
        {children}
      </body>
    </html>
  );
}

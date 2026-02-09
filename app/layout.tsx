import "./globals.css";
import { Space_Grotesk, Inter } from "next/font/google";
import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";

// Trendy "Tech" fonts
const space = Space_Grotesk({ subsets: ["latin"], variable: '--font-space' });
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "Pure Electric Repair OS",
  description: "Modular Workshop Interface",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${space.variable} ${inter.variable} font-sans h-screen p-4 overflow-hidden`}>
        {/* The Main "Device" Frame */}
        <div className="h-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border-4 border-white ring-1 ring-slate-200">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-[#E5E7EB]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layouts/sidebar";

export const metadata: Metadata = {
  title: "The Ancient Aliens Encyclopedia",
  description: "A Guide to the Episodes, Civilizations, Artifacts, Gods, Locations, and Theories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        <main className="ml-64 min-h-screen p-6">
          {children}
        </main>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import AdminHotkey from "@/components/AdminHotkey";
import LogoutButton from "@/components/LogoutButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OneShot Builds",
  description: "Professional single purpose builds and community showcases.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AdminHotkey />
        <header className="sticky top-0 z-50 bg-[#0b0b14]/70 backdrop-blur supports-[backdrop-filter]:bg-[#0b0b14]/50 shadow-sm">
          <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
            <Link href="/" className="font-semibold tracking-tight gradient-text">OneShot Builds</Link>
            <nav className="flex items-center gap-6 text-sm text-neutral-200">
              <Link href="/explore" className="hover:text-white">Explore</Link>
              <Link href="/submit" className="hover:text-white">Submit</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-10 min-h-[calc(100vh-8rem)]">{children}</main>
        <footer className="bg-[#0b0b14]/70 backdrop-blur supports-[backdrop-filter]:bg-[#0b0b14]/50">
          <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between text-sm text-neutral-300">
            <span>© {new Date().getFullYear()} OneShot Builds</span>
            <div className="flex items-center gap-4">
              <span>One purpose. One solution. One shot.</span>
              <Link href="/admin" className="text-neutral-400 hover:text-white">Admin</Link>
              <LogoutButton />
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

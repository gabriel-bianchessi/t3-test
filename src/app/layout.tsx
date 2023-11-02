import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider headers={headers()}>
          <header className="w-full h-[80px] bg-zinc-100 flex justify-center">
            <div className="container flex items-center">
              <div className="flex gap-4">
                <Link href="/" className="text-zinc-800 hover:text-purple-500 duration-100 transition-colors">
                  Home
                </Link>
                <Link href="/admin/" className="text-zinc-800 hover:text-purple-500 duration-100 transition-colors">
                  Admin
                </Link>
              </div>
            </div>
          </header>
          <main className="w-full flex items-center justify-center">
            <div className="container">
              {children}
            </div>
          </main>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}

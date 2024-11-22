"use client"; // Marking this file as a Client Component

import localFont from "next/font/local";
import "./globals.css";
import NavBar from "@/app/components/NavBar";
import { ThemeProvider } from "@/app/components/theme-provider";
import { StoreProvider } from "./Redux/StoreProvider";

// Font definitions
const geistSans = localFont({
  src: "/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
 
  return (
    <StoreProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider>
            <NavBar />
         
            {children}
          </ThemeProvider>
        </body>
      </html>
    </StoreProvider>
  );
}

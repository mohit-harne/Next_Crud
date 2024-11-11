"use client"; // Marking this file as a Client Component

import localFont from "next/font/local";
import "./globals.css";
import NavBar from "@/app/components/NavBar";
import { ThemeProvider } from "@/app/components/theme-provider";
import { StoreProvider } from "./Redux/StoreProvider";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'; // Use this instead of useRouter
import Loading from "./Loading";

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
  const [loading, setLoading] = useState(false);
  const pathname = usePathname(); // Get current pathname

  useEffect(() => {
    setLoading(true);
    
    // Simulate loading time for demonstration (you can adjust this)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Adjust duration as needed

    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, [pathname]); // Trigger effect on pathname change

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

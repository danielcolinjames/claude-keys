import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claude Keys",
  description: "API key management for Claude",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

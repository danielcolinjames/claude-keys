import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claude",
  description: "Claude Keys — API key management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US" data-theme="claude" data-mode="dark" className="h-screen antialiased scroll-smooth">
      <body>
        {children}
      </body>
    </html>
  );
}

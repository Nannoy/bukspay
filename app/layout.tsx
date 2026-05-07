import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuksPay — Digital Banking",
  description: "A deliberately vulnerable fintech app for OWASP security education",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ colorScheme: "light" }}>
      <body style={{ colorScheme: "light" }}>{children}</body>
    </html>
  );
}

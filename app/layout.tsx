import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wazuh SOC Ticketing",
  description: "Lightweight SOC ticketing platform over Wazuh Indexer",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

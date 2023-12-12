import type { Metadata } from "next";
import { Inconsolata } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marked Personas",
  description: "",
};

const font = Inconsolata({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={font.className}>
      <body>{children}</body>
    </html>
  );
}

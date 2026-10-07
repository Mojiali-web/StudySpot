import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudySpot — Find people studying what you're studying",
  description:
    "Start a study session on campus or jump into one that's already happening. An independent student project, not affiliated with UC Davis.",
};

export const viewport: Viewport = { themeColor: "#fbf8f2" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}

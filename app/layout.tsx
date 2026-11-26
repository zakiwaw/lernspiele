import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/components/AppProvider";

export const metadata: Metadata = {
  title: "Lernspiele",
  description: "Lernspiele für Kinder – Formen, Muster, Zahlen und Wörter.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lernspiele",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

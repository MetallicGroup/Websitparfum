import type { Metadata } from "next";
import { Nunito, Quicksand } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "KiddyShop - Totul pentru copilul tău",
    template: "%s | KiddyShop"
  },
  description: "Magazin online premium pentru copii și bebeluși. Haine, jucării și accesorii de calitate.",
  metadataBase: new URL('https://kiddyshop.ro'),
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className={`${nunito.variable} ${quicksand.variable}`}>
        {children}
      </body>
    </html>
  );
}

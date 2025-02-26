import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import ClientLayout from './ClientLayout';

const inter = Inter({ subsets: ["latin"] });
const orbitron = Orbitron({ 
  weight: ['400', '700'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  title: "Luna",
  description: "Your Cosmic Guide to Exploring the Universe!", 
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} ${orbitron.className}`}>
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
      </body>
    </html>
  );
}

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/variables.css";
import "../styles/animations.css";
import { AuthProvider } from '../context/AuthContext'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GymSwipe - Encuentra tu entrenador personal perfecto",
  description: "Descubre entrenadores personales cerca de ti con GymSwipe. Conecta con profesionales del fitness que se adapten a tus necesidades y objetivos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

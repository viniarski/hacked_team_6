// app/layout.jsx
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import ThemeProvider from '@/components/ThemeProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Flaura - Smart Plant Monitoring',
  description: 'Monitor and care for your plants with precision',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className={inter.className}>
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}

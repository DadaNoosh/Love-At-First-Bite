import './globals.css';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

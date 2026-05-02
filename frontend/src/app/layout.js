import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Providers from '@/components/Providers';
import LayoutShell from '@/components/layout/LayoutShell';

export const metadata = {
  title: "WearMuse — Gen Z Fashion Destination",
  description: "Discover the trendiest fashion for Gen Z. Bold styles, unbeatable prices.",
  keywords: "fashion, gen z, trendy, clothing, accessories, online shopping",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body bg-light text-dark antialiased">
        <Providers>
          <Toaster
            position="top-center"
            toastOptions={{
              style: { borderRadius: '16px', background: '#1A1A2E', color: '#fff', fontFamily: 'Inter' },
              success: { iconTheme: { primary: '#00D2A0', secondary: '#fff' } },
              error: { iconTheme: { primary: '#FF4757', secondary: '#fff' } },
            }}
          />
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  );
}

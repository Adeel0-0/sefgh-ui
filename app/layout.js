import "./globals.css";
import { RootProviders } from "@/components/providers/root-providers";

export const metadata = {
  title: "SEFGH - GitHub Search Engine",
  description: "AI-first conversational GitHub search engine",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <RootProviders>
          {children}
        </RootProviders>
      </body>
    </html>
  );
}

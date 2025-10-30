import "./globals.css";

export const metadata = {
  title: "SEFGH AI - GitHub Search Engine",
  description: "AI-first conversational GitHub search engine",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans">
        <div className="flex h-screen bg-background text-foreground">
          {/* Sidebar - placeholder for future navigation */}
          <aside className="w-16 border-r border-border bg-card flex-shrink-0">
            {/* Future navigation items */}
          </aside>
          
          {/* Main content area */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

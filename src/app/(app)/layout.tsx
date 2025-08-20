import MainNav from '@/components/main-nav';
import { DataProvider } from '@/context/data-context';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DataProvider>
      <div className="flex flex-col h-screen">
        <main className="flex-1 overflow-hidden pb-16" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          {children}
        </main>
        <MainNav />
      </div>
    </DataProvider>
  );
}

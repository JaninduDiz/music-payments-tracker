import MainNav from '@/components/main-nav';
import { DataProvider } from '@/context/data-context';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DataProvider>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 pb-24" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          {children}
        </main>
        <MainNav />
      </div>
    </DataProvider>
  );
}

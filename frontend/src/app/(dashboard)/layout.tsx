import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { NetworkProvider } from "@/lib/network-context";
import { initialParticipants } from "@/lib/network-data";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NetworkProvider initialParticipants={initialParticipants}>
      <div className="flex h-screen bg-[var(--bg-secondary)]">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </NetworkProvider>
  );
}

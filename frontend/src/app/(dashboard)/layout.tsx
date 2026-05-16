import Sidebar from "@/components/Sidebar";
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
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </NetworkProvider>
  );
}

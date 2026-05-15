import Sidebar from "@/components/Sidebar";
import { NetworkProvider } from "@/lib/network-context";
import { getNetworkParticipants } from "@/lib/queries";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const participants = await getNetworkParticipants();

  return (
    <NetworkProvider initialParticipants={participants}>
      <div className="flex h-screen bg-[var(--sidebar-bg)]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="m-2 bg-[var(--bg-primary)] rounded-2xl min-h-[calc(100vh-16px)] shadow-lg shadow-black/5">
            <div className="p-6">{children}</div>
          </div>
        </main>
      </div>
    </NetworkProvider>
  );
}

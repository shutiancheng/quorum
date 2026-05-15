import { getFraudCases } from "@/lib/queries";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const cases = await getFraudCases();
  return <DashboardClient cases={cases} />;
}

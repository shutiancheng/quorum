import { getAttackAgents, getSimulatedSystems } from "@/lib/queries";
import AttackSimulationClient from "./AttackSimulationClient";

export default async function AttackSimulationPage() {
  const [agents, systems] = await Promise.all([
    getAttackAgents(),
    getSimulatedSystems(),
  ]);

  return <AttackSimulationClient initialAgents={agents} initialSystems={systems} />;
}

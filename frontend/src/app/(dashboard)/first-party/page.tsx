import { getFraudCases } from "@/lib/queries";
import FraudTypePage from "@/components/FraudTypePage";

export default async function FirstPartyPage() {
  const allCases = await getFraudCases();
  const cases = allCases.filter((c) => c.type === "First-Party");

  return (
    <FraudTypePage
      title="First-Party Fraud"
      description="Account holders making legitimate purchases then falsely claiming fraud for refunds"
      cases={cases}
    />
  );
}

import { getFraudCases } from "@/lib/queries";
import FraudTypePage from "@/components/FraudTypePage";

export default async function CollusionPage() {
  const allCases = await getFraudCases();
  const cases = allCases.filter((c) => c.type === "Collusion");

  return (
    <FraudTypePage
      title="Collusion Detection"
      description="Coordinated fraud rings with multiple accounts working together to exploit PayPal systems"
      cases={cases}
    />
  );
}

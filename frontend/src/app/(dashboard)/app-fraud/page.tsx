import { getFraudCases } from "@/lib/queries";
import FraudTypePage from "@/components/FraudTypePage";

export default async function APPFraudPage() {
  const allCases = await getFraudCases();
  const cases = allCases.filter((c) => c.type === "APP Fraud");

  return (
    <FraudTypePage
      title="Authorised Push Payment Fraud"
      description="Victims manipulated into authorising payments to fraudsters via PayPal"
      cases={cases}
    />
  );
}

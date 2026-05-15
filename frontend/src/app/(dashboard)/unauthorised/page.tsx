import { getFraudCases } from "@/lib/queries";
import FraudTypePage from "@/components/FraudTypePage";

export default async function UnauthorisedPage() {
  const allCases = await getFraudCases();
  const cases = allCases.filter((c) => c.type === "Unauthorised");

  return (
    <FraudTypePage
      title="Unauthorised Fraud"
      description="Transactions executed without the account holder's knowledge or consent (account takeover, credential theft)"
      cases={cases}
    />
  );
}

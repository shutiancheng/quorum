import { getCountryFraudData, getAlertTrends, getFraudByType } from "@/lib/queries";
import AnalyticsClient from "./AnalyticsClient";

export default async function AnalyticsPage() {
  const [countryFraud, alertTrends, fraudByType] = await Promise.all([
    getCountryFraudData(),
    getAlertTrends(),
    getFraudByType(),
  ]);

  return (
    <AnalyticsClient
      countryFraud={countryFraud}
      alertTrends={alertTrends}
      fraudByType={fraudByType}
    />
  );
}

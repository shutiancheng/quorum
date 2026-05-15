"use client";

import { useState } from "react";
import TabNav from "@/components/TabNav";
import { useNetwork } from "@/lib/network-context";
import { hashIdentifier, laplaceMechanism } from "@/lib/crypto";
import { JURISDICTIONS } from "@/lib/network-data";
import { Search, FlaskConical } from "lucide-react";

const tabs = ["Query Demo", "Privacy Engine"];

export default function QueryPrivacyPage() {
  const [activeTab, setActiveTab] = useState("Query Demo");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          Query & Privacy
        </h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">
          Interactive privacy-preserving query simulation and cryptographic
          primitive demos
        </p>
      </div>

      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "Query Demo" && <QueryDemoView />}
      {activeTab === "Privacy Engine" && <PrivacyEngineView />}
    </div>
  );
}

/* ── Query Demo ── */
function QueryDemoView() {
  const { participants, runQuery, queryLog, bloomFilter } = useNetwork();
  const [selectedQuerier, setSelectedQuerier] = useState(participants[0].id);
  const [testId, setTestId] = useState("");

  const handleQuery = () => {
    const hash = hashIdentifier(
      testId || "test_entity_" + Date.now(),
      "global_salt_v1"
    );
    runQuery(selectedQuerier, hash);
  };

  const handleKnownFraud = () => {
    const hash = hashIdentifier("fraud_entity_42", "global_salt_v1");
    runQuery(selectedQuerier, hash);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-5">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">
          Interactive Query Simulation
        </h3>
        <div className="flex gap-3 items-end flex-wrap">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Querying Node
            </label>
            <select
              value={selectedQuerier}
              onChange={(e) => setSelectedQuerier(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-colors"
            >
              {participants.map((p) => (
                <option key={p.id} value={p.id}>
                  {JURISDICTIONS[p.jurisdiction]?.flag} {p.name} (credits:{" "}
                  {p.credits})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Identifier (will be hashed)
            </label>
            <input
              value={testId}
              onChange={(e) => setTestId(e.target.value)}
              placeholder="e.g. entity_12345"
              className="px-3 py-2 text-sm rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-colors w-48"
            />
          </div>
          <button
            onClick={handleQuery}
            className="px-4 py-2.5 text-sm font-medium rounded-xl bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] hover:bg-[var(--brand-primary-hover)] transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            Query (Custom)
          </button>
          <button
            onClick={handleKnownFraud}
            className="px-4 py-2.5 text-sm font-medium rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Query (Known Fraud)
          </button>
        </div>
        <div className="mt-3 px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] text-xs text-[var(--text-tertiary)]">
          The identifier is hashed locally before querying. The coordination
          layer sees only cryptographic tokens. Try &quot;Known Fraud&quot; to
          see a positive Bloom filter match.
        </div>
      </div>

      {/* Query Log */}
      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)]">
        <div className="px-5 py-4 border-b border-[var(--border-primary)]">
          <h3 className="font-semibold text-[var(--text-primary)]">
            Query Log
          </h3>
        </div>
        <div className="p-4 max-h-[400px] overflow-auto space-y-2">
          {queryLog.length === 0 ? (
            <div className="text-center py-12 text-sm text-[var(--text-tertiary)]">
              Run a query above to see results here
            </div>
          ) : (
            queryLog.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-xl border animate-card-in"
                style={{
                  backgroundColor:
                    q.status === "DENIED"
                      ? "var(--fraud-critical-bg)"
                      : "var(--bg-secondary)",
                  borderColor:
                    q.status === "DENIED"
                      ? "var(--fraud-critical)"
                      : "var(--border-primary)",
                  borderWidth: "1px",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="font-semibold text-sm"
                    style={{
                      color:
                        q.status === "DENIED"
                          ? "var(--fraud-critical)"
                          : "var(--text-primary)",
                    }}
                  >
                    {q.querier}
                  </span>
                  <span
                    className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor:
                        q.status === "DENIED"
                          ? "var(--fraud-critical-bg)"
                          : "var(--fraud-cleared-bg)",
                      color:
                        q.status === "DENIED"
                          ? "var(--fraud-critical)"
                          : "var(--fraud-cleared)",
                    }}
                  >
                    {q.status}
                  </span>
                </div>
                {q.status === "DENIED" ? (
                  <p className="text-xs text-[var(--fraud-critical)]">
                    {q.reason}
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div>
                      <span className="text-[var(--text-tertiary)]">
                        Hash:{" "}
                      </span>
                      <span className="font-mono text-[var(--text-secondary)]">
                        {q.hash?.slice(0, 16)}...
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text-tertiary)]">
                        Bloom match:{" "}
                      </span>
                      <span
                        className="font-semibold"
                        style={{
                          color: q.bloomMatch
                            ? "var(--fraud-critical)"
                            : "var(--fraud-cleared)",
                        }}
                      >
                        {q.bloomMatch ? "POSITIVE" : "NEGATIVE"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text-tertiary)]">
                        DP count (\u03B5={q.epsilonUsed}):{" "}
                      </span>
                      <span className="text-[var(--accent-color)]">
                        {q.dpAggregateCount}
                      </span>
                      <span className="text-[var(--text-tertiary)]">
                        {" "}
                        (true: {q.trueCount})
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text-tertiary)]">
                        Responding nodes:{" "}
                      </span>
                      <span className="text-[var(--text-secondary)]">
                        {q.respondingNodes}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[var(--text-tertiary)]">
                        Privacy:{" "}
                      </span>
                      <span className="text-[var(--accent-color)]">
                        {q.privacyGuarantee}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Privacy Engine ── */
function PrivacyEngineView() {
  const { bloomFilter } = useNetwork();
  const [testInput, setTestInput] = useState("");
  const [testResult, setTestResult] = useState<{
    input: string;
    hash: string;
    match: boolean;
    fpr: number;
  } | null>(null);
  const [dpDemo, setDpDemo] = useState<
    { epsilon: number; samples: number[]; mean: string; std: string }[]
  >([]);

  const testBloom = () => {
    const hash = hashIdentifier(testInput, "global_salt_v1");
    const result = bloomFilter.test(hash);
    setTestResult({
      input: testInput,
      hash,
      match: result,
      fpr: bloomFilter.getFalsePositiveRate(),
    });
  };

  const runDpDemo = () => {
    const trueValue = 42;
    const results: typeof dpDemo = [];
    for (const eps of [0.1, 0.5, 1.0, 2.0, 5.0]) {
      const samples = Array.from({ length: 20 }, () =>
        laplaceMechanism(trueValue, eps)
      );
      const mean = (
        samples.reduce((a, b) => a + b, 0) / samples.length
      ).toFixed(1);
      const std = Math.sqrt(
        samples.reduce((s, v) => s + Math.pow(v - trueValue, 2), 0) /
          samples.length
      ).toFixed(1);
      results.push({ epsilon: eps, samples, mean, std });
    }
    setDpDemo(results);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Bloom Filter Demo */}
        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-5">
          <h3 className="font-semibold text-[var(--text-primary)] mb-2">
            Bloom Filter Demo
          </h3>
          <p className="text-xs text-[var(--text-tertiary)] mb-3">
            Test an identifier against the Bloom filter. The filter contains
            200 pre-loaded &quot;known fraud&quot; hashed entities. Try
            &quot;fraud_entity_42&quot; for a known match.
          </p>
          <div className="flex gap-2 mb-3">
            <input
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Enter identifier..."
              className="flex-1 px-3 py-2 text-sm rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-colors"
            />
            <button
              onClick={testBloom}
              className="px-4 py-2 text-sm font-medium rounded-xl bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] hover:bg-[var(--brand-primary-hover)] transition-colors"
            >
              Test
            </button>
          </div>
          {testResult && (
            <div className="p-3 rounded-xl bg-[var(--bg-tertiary)] text-xs space-y-1">
              <div>
                <span className="text-[var(--text-tertiary)]">Input: </span>
                {testResult.input}
              </div>
              <div>
                <span className="text-[var(--text-tertiary)]">Hash: </span>
                <span className="text-[var(--accent-color)] font-mono">
                  {testResult.hash}
                </span>
              </div>
              <div>
                <span className="text-[var(--text-tertiary)]">Match: </span>
                <span
                  className="font-bold"
                  style={{
                    color: testResult.match
                      ? "var(--fraud-critical)"
                      : "var(--fraud-cleared)",
                  }}
                >
                  {testResult.match ? "PROBABLE MATCH" : "NOT IN SET"}
                </span>
              </div>
              <div>
                <span className="text-[var(--text-tertiary)]">
                  False positive rate:{" "}
                </span>
                {(testResult.fpr * 100).toFixed(4)}%
              </div>
            </div>
          )}
          <div className="mt-3 text-[10px] text-[var(--text-tertiary)]">
            Filter size: {bloomFilter.size} bits | Hash functions:{" "}
            {bloomFilter.hashCount} | Items: {bloomFilter.itemCount}
          </div>
        </div>

        {/* Differential Privacy Demo */}
        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)] p-5">
          <h3 className="font-semibold text-[var(--text-primary)] mb-2">
            Differential Privacy Demo
          </h3>
          <p className="text-xs text-[var(--text-tertiary)] mb-3">
            True count = 42. See how Laplace noise at different \u03B5 values
            affects the reported aggregate. Lower \u03B5 = more privacy, more
            noise.
          </p>
          <button
            onClick={runDpDemo}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] hover:bg-[var(--brand-primary-hover)] transition-colors mb-3 flex items-center gap-2"
          >
            <FlaskConical className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            Generate DP Samples
          </button>
          {dpDemo.length > 0 && (
            <div className="space-y-3">
              {dpDemo.map((d) => (
                <div key={d.epsilon}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold text-[var(--accent-color)]">
                      \u03B5 = {d.epsilon}
                    </span>
                    <span className="text-[10px] text-[var(--text-tertiary)]">
                      mean={d.mean} \u03C3={d.std}
                    </span>
                  </div>
                  <div className="flex gap-0.5 h-5 items-end">
                    {d.samples.map((v, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{
                          height: `${Math.max(10, Math.min(100, (v / 42) * 90))}%`,
                          backgroundColor:
                            Math.abs(v - 42) > 15
                              ? "var(--fraud-critical)"
                              : Math.abs(v - 42) > 5
                              ? "var(--fraud-warning)"
                              : "var(--fraud-cleared)",
                          opacity: 0.7,
                        }}
                        title={String(v)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Techniques Matrix */}
      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] shadow-[var(--card-shadow)]">
        <div className="px-5 py-4 border-b border-[var(--border-primary)]">
          <h3 className="font-semibold text-[var(--text-primary)]">
            Privacy Techniques Matrix
          </h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-primary)]">
              {[
                "Technique",
                "Purpose",
                "What Crosses Boundary",
                "What Stays Local",
                "Trade-off",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left py-3 px-4 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Bloom Filters", "Set membership queries", "Bit array (probabilistic)", "Raw identifiers, PII", "False positives possible (~0.01%)"],
              ["Differential Privacy", "Aggregate counts", "Noisy count (\u03B5-calibrated)", "True counts, individual records", "Accuracy decreases with privacy"],
              ["Salted Hashing", "Identifier pseudonymisation", "Hashed tokens only", "Plaintext identifiers", "Irreversible without salt"],
              ["Jurisdiction Gating", "Cross-border compliance", "Aggregate-only across borders", "Detailed signals stay in-jurisdiction", "Reduced utility for cross-border queries"],
              ["k-Anonymity", "Re-identification prevention", "Responses only if k\u22653 sources", "Unique / rare signals suppressed", "Rare fraud patterns harder to detect"],
            ].map((row) => (
              <tr key={row[0]} className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-secondary)] transition-colors">
                <td className="py-3 px-4 text-[var(--accent-color)] font-medium">{row[0]}</td>
                <td className="py-3 px-4 text-[var(--text-secondary)]">{row[1]}</td>
                <td className="py-3 px-4 text-[var(--text-secondary)]">{row[2]}</td>
                <td className="py-3 px-4 text-[var(--text-secondary)]">{row[3]}</td>
                <td className="py-3 px-4 text-[var(--text-tertiary)]">{row[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

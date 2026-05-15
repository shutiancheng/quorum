"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { BloomFilter, hashIdentifier, laplaceMechanism } from "./crypto";
import {
  SIGNAL_TYPES,
  PRIVACY_METHODS,
  type Participant,
  type LiveSignal,
  type QueryResult,
} from "./network-data";

interface NetworkContextValue {
  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
  liveSignals: LiveSignal[];
  queryLog: QueryResult[];
  bloomFilter: BloomFilter;
  runQuery: (queryingParticipantId: string, targetHash: string) => void;
  contributeSignals: (participantId: string, count: number) => void;
}

const NetworkContext = createContext<NetworkContextValue | null>(null);

export function useNetwork() {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error("useNetwork must be used within NetworkProvider");
  return ctx;
}

export function NetworkProvider({
  children,
  initialParticipants,
}: {
  children: ReactNode;
  initialParticipants: Participant[];
}) {
  const [participants, setParticipants] =
    useState<Participant[]>(initialParticipants);
  const [liveSignals, setLiveSignals] = useState<LiveSignal[]>([]);
  const [queryLog, setQueryLog] = useState<QueryResult[]>([]);

  // Initialize bloom filter with "known fraud" entities
  const [bloomFilter] = useState(() => {
    const bf = new BloomFilter(2048, 5);
    for (let i = 0; i < 200; i++) {
      bf.add(hashIdentifier(`fraud_entity_${i}`, "global_salt_v1"));
    }
    return bf;
  });

  // Simulate live signal ingestion
  useEffect(() => {
    const interval = setInterval(() => {
      const p = participants[Math.floor(Math.random() * participants.length)];
      const signalTypes = SIGNAL_TYPES[p.type];
      const signal: LiveSignal = {
        id:
          Date.now().toString(36) +
          Math.random().toString(36).slice(2, 6),
        timestamp: new Date().toISOString(),
        source: p.name,
        sourceType: p.type,
        jurisdiction: p.jurisdiction,
        signalType:
          signalTypes[Math.floor(Math.random() * signalTypes.length)],
        privacyMethod:
          PRIVACY_METHODS[
            Math.floor(Math.random() * PRIVACY_METHODS.length)
          ],
        confidence: (0.6 + Math.random() * 0.39).toFixed(2),
      };
      setLiveSignals((prev) => [signal, ...prev].slice(0, 50));
    }, 2200);
    return () => clearInterval(interval);
  }, [participants]);

  const runQuery = useCallback(
    (queryingParticipantId: string, targetHash: string) => {
      const querier = participants.find(
        (p) => p.id === queryingParticipantId
      );
      if (!querier) return;

      // Reciprocity check
      if (querier.credits <= 0) {
        setQueryLog((prev) =>
          [
            {
              id: Date.now(),
              timestamp: new Date().toISOString(),
              querier: querier.name,
              status: "DENIED" as const,
              reason:
                "Insufficient reciprocity credits. Contribute signals to earn query rights.",
              hash: targetHash,
            },
            ...prev,
          ].slice(0, 30)
        );
        return;
      }

      // Bloom filter test
      const isMatch = bloomFilter.test(targetHash);
      const trueCount = isMatch ? Math.floor(Math.random() * 5) + 1 : 0;
      const dpCount = laplaceMechanism(trueCount, 0.5);

      // Jurisdiction-aware response filtering
      const respondingNodes = participants
        .filter((p) => p.id !== querier.id && p.credits > 0)
        .map((p) => ({
          name: p.name,
          jurisdiction: p.jurisdiction,
          canShareDetail:
            p.jurisdiction === querier.jurisdiction
              ? "full"
              : "aggregate_only",
        }));

      const result: QueryResult = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        querier: querier.name,
        querierJurisdiction: querier.jurisdiction,
        hash: targetHash,
        bloomMatch: isMatch,
        dpAggregateCount: dpCount,
        trueCount,
        epsilonUsed: 0.5,
        respondingNodes: respondingNodes.length,
        jurisdictionFiltering: respondingNodes,
        status: "COMPLETED",
        privacyGuarantee: "\u03B5=0.5 differential privacy, k\u22653 anonymity",
      };

      setQueryLog((prev) => [result, ...prev].slice(0, 30));

      // Deduct credit
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === queryingParticipantId
            ? {
                ...p,
                queriesUsed: p.queriesUsed + 1,
                credits: p.credits - 1,
              }
            : p
        )
      );
    },
    [participants, bloomFilter]
  );

  const contributeSignals = useCallback(
    (participantId: string, count: number) => {
      setParticipants((prev) =>
        prev.map((p) => {
          if (p.id !== participantId) return p;
          const creditMultiplier = p.tier === "full" ? 1 : 2;
          const newCredits = p.credits + count * creditMultiplier;
          return {
            ...p,
            contributedSignals: p.contributedSignals + count,
            credits: newCredits,
            tier: newCredits > 0 ? "full" : p.tier,
          };
        })
      );
    },
    []
  );

  return (
    <NetworkContext.Provider
      value={{
        participants,
        setParticipants,
        liveSignals,
        queryLog,
        bloomFilter,
        runQuery,
        contributeSignals,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

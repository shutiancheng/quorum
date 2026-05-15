// ============================================================
// CRYPTOGRAPHIC / PRIVACY PRIMITIVES (Simulated for PoC)
// ============================================================

/**
 * Bloom Filter for privacy-preserving set membership testing.
 * Participants publish Bloom filters rather than raw identifiers —
 * you can test "is X in the set?" but cannot enumerate the set.
 */
export class BloomFilter {
  size: number;
  hashCount: number;
  bits: Uint8Array;
  itemCount: number;

  constructor(size = 1024, hashCount = 3) {
    this.size = size;
    this.hashCount = hashCount;
    this.bits = new Uint8Array(size);
    this.itemCount = 0;
  }

  private _hashes(item: string): number[] {
    const results: number[] = [];
    const str = String(item);
    for (let i = 0; i < this.hashCount; i++) {
      let hash = 0;
      for (let j = 0; j < str.length; j++) {
        hash = ((hash << 5) - hash + str.charCodeAt(j) * (i + 1)) | 0;
      }
      results.push(Math.abs(hash) % this.size);
    }
    return results;
  }

  add(item: string) {
    this._hashes(item).forEach((h) => (this.bits[h] = 1));
    this.itemCount++;
  }

  test(item: string): boolean {
    return this._hashes(item).every((h) => this.bits[h] === 1);
  }

  getFalsePositiveRate(): number {
    const setBits = this.bits.reduce((a, b) => a + b, 0);
    return Math.pow(setBits / this.size, this.hashCount);
  }
}

/**
 * Differential Privacy: Laplace mechanism.
 * Adds calibrated noise to true aggregate counts so that
 * individual participation is plausibly deniable.
 */
export function laplaceMechanism(
  trueValue: number,
  epsilon = 1.0,
  sensitivity = 1.0
): number {
  const b = sensitivity / epsilon;
  const u = Math.random() - 0.5;
  const noise = -b * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
  return Math.max(0, Math.round(trueValue + noise));
}

/**
 * Simplified hash function for identifier pseudonymisation.
 * In production this would be SHA-256 with a rotated salt.
 */
export function hashIdentifier(id: string, salt: string): string {
  let hash = 0;
  const str = salt + ":" + id;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

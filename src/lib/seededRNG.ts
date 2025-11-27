// Deterministic seeded PRNG utilities for snow simulation
// Mulberry32 implementation with simple string hashing.

export type RNG = () => number;

function hashStringToSeed(input: string): number {
  let h = 1779033703 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(h ^ input.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  h ^= h >>> 16;
  return h >>> 0;
}

export function mulberry32(seed: number): RNG {
  let t = seed >>> 0;
  return function () {
    t |= 0;
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function createSeededRNG(seedSource: string | number): RNG {
  const seedNumber =
    typeof seedSource === "number"
      ? seedSource >>> 0
      : hashStringToSeed(seedSource);
  return mulberry32(seedNumber);
}

export function rngInt(rng: RNG, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function rngFloat(rng: RNG, min: number, max: number): number {
  return rng() * (max - min) + min;
}

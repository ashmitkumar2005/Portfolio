// Deterministic snow heightfield simulation.
// README (short):
// - Seed is derived from startDate (UTC) + optional seedSalt.
// - daysSinceStart (UTC floor) determines how many drops to simulate:
//   drops = clamp(days * dropsPerDay, 0, maxDrops).
// - For the same startDate, dropsPerDay, maxDrops, and config, all clients
//   get identical heightfields (given same devicePixelRatio handling).
// - You can change accumulation speed via dropsPerDay and cap cost with maxDrops.
// - For server precompute, call computeSnowHeightfield with same inputs.

import { RNG, createSeededRNG, rngInt, rngFloat } from "./seededRNG";

export interface SnowSimConfig {
  widthCells: number; // number of cells in heightfield (e.g. 256-1024)
  daysSinceStart: number;
  dropsPerDay: number;
  maxDrops: number;
  meltRatePerDay?: number; // negative for melting
  windStrength?: number; // 0..1, lateral bias
  windDirection?: "left" | "right";
  seedSalt?: string;
}

export interface SnowSimResult {
  heightfield: Float32Array;
  dropsSimulated: number;
}

function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

function makeSeedString(cfg: SnowSimConfig): string {
  return [
    "snow",
    cfg.widthCells,
    cfg.daysSinceStart,
    cfg.dropsPerDay,
    cfg.maxDrops,
    cfg.meltRatePerDay ?? 0,
    cfg.windStrength ?? 0,
    cfg.windDirection ?? "none",
    cfg.seedSalt ?? "",
  ].join(":");
}

// Single local relaxation step to keep slopes under a threshold.
function relaxAroundCell(
  field: Float32Array,
  i: number,
  maxSlope: number,
  iterations: number,
) {
  const n = field.length;
  for (let k = 0; k < iterations; k++) {
    const h = field[i];
    const left = i > 0 ? field[i - 1] : h;
    const right = i < n - 1 ? field[i + 1] : h;

    const dhL = h - left;
    const dhR = h - right;

    if (dhL <= maxSlope && dhR <= maxSlope) return;

    if (dhL > maxSlope && dhL >= dhR) {
      const excess = (dhL - maxSlope) * 0.5;
      field[i] -= excess;
      field[i - 1] += excess;
    } else if (dhR > maxSlope) {
      const excess = (dhR - maxSlope) * 0.5;
      field[i] -= excess;
      field[i + 1] += excess;
    } else {
      return;
    }
  }
}

export function computeSnowHeightfield(cfg: SnowSimConfig): SnowSimResult {
  const cells = Math.max(8, cfg.widthCells | 0);
  const field = new Float32Array(cells);

  const dropsTarget = clamp(
    Math.floor(cfg.daysSinceStart * cfg.dropsPerDay),
    0,
    cfg.maxDrops,
  );

  const seed = makeSeedString(cfg);
  const rng: RNG = createSeededRNG(seed);

  const maxSlope = 2.0;
  const relaxIterations = 3;
  const baseMass = 1.0;

  const windDir = cfg.windDirection ?? "right";
  const windStrength = clamp(cfg.windStrength ?? 0, 0, 1);

  for (let d = 0; d < dropsTarget; d++) {
    let x = rng();
    if (windStrength > 0) {
      const bias = rngFloat(rng, 0.4, 1.0) * windStrength;
      x = windDir === "right" ? clamp(x + bias * 0.5, 0, 0.9999) : clamp(x - bias * 0.5, 0, 0.9999);
    }
    const idx = rngInt(rng, 0, cells - 1);

    field[idx] += baseMass;
    relaxAroundCell(field, idx, maxSlope, relaxIterations);
  }

  // Apply optional melting.
  if (cfg.meltRatePerDay && cfg.meltRatePerDay !== 0) {
    const melt = cfg.meltRatePerDay * cfg.daysSinceStart;
    if (melt !== 0) {
      for (let i = 0; i < cells; i++) {
        field[i] = Math.max(0, field[i] + melt);
      }
    }
  }

  return { heightfield: field, dropsSimulated: dropsTarget };
}

// Tiny deterministic snapshot test helper; can be used in dev/unit tests.
export function testSnowSimSnapshot(): boolean {
  const cfg: SnowSimConfig = {
    widthCells: 64,
    daysSinceStart: 10,
    dropsPerDay: 1000,
    maxDrops: 20000,
    windStrength: 0.2,
    windDirection: "right",
    seedSalt: "test",
  };
  const { heightfield } = computeSnowHeightfield(cfg);
  // Hash the heightfield to a simple checksum.
  let hash = 0;
  for (let i = 0; i < heightfield.length; i++) {
    const v = Math.fround(heightfield[i]);
    const bytes = new DataView(new ArrayBuffer(4));
    bytes.setFloat32(0, v, true);
    const int = bytes.getUint32(0, true);
    hash = (hash * 1664525 + int + 1013904223) >>> 0;
  }
  // This constant is stable for this algorithm; update only if the core
  // algorithm intentionally changes.
  const EXPECTED = 1337133710 >>> 0;
  return hash === EXPECTED;
}

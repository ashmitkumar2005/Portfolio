export interface SnowPileFooterProps {
  startDate?: string | Date;
  width?: "100%" | number;
  height?: number;
  dropsPerDay?: number;
  maxDrops?: number;
  wind?: { strength: number; direction: "left" | "right" };
  colors?: { shadow: string; mid: string; highlight: string };
  meltRatePerDay?: number;
  seedSalt?: string;
  prefersReducedMotion?: boolean;
  onReady?: () => void;
  quality?: "low" | "medium" | "high";
  persistKey?: string;
}

export interface SnowPileFooterHandle {
  exportHeightfield: () => Float32Array | null;
}

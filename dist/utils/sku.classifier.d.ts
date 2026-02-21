/**
 * SKU classification for Commerce Decision Intelligence.
 * Classifies products into: Star, Hidden Gem, Illusion Bestseller, Cash Burner.
 */
import type { SkuClassification } from "../db/schema/skus.js";
export interface ClassifyInput {
    netProfit: number;
    revenue: number;
    /** True if this SKU's sales volume is in the top tier (e.g. above 75th percentile). */
    isHighVolume: boolean;
}
/**
 * Classifies a SKU based on margin and sales volume.
 * - Star: margin > 20% AND sales volume high
 * - Hidden Gem: margin > 20% AND sales volume low
 * - Illusion Bestseller: sales volume high AND margin < 5%
 * - Cash Burner: net_profit < 0
 */
export declare function classifySku(input: ClassifyInput): SkuClassification | null;
/**
 * Risk score 0–100 (higher = riskier). Used for SKU risk_score field.
 */
export declare function computeRiskScore(classification: SkuClassification | null, marginPercent: number, netProfit: number): number;
//# sourceMappingURL=sku.classifier.d.ts.map
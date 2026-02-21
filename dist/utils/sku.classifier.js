/**
 * SKU classification for Commerce Decision Intelligence.
 * Classifies products into: Star, Hidden Gem, Illusion Bestseller, Cash Burner.
 */
const MARGIN_HIGH_THRESHOLD_PERCENT = 20;
const MARGIN_LOW_THRESHOLD_PERCENT = 5;
/**
 * Classifies a SKU based on margin and sales volume.
 * - Star: margin > 20% AND sales volume high
 * - Hidden Gem: margin > 20% AND sales volume low
 * - Illusion Bestseller: sales volume high AND margin < 5%
 * - Cash Burner: net_profit < 0
 */
export function classifySku(input) {
    const { netProfit, revenue, isHighVolume } = input;
    const marginPercent = revenue > 0 ? (netProfit / revenue) * 100 : 0;
    const isHighMargin = marginPercent > MARGIN_HIGH_THRESHOLD_PERCENT;
    const isLowMargin = marginPercent < MARGIN_LOW_THRESHOLD_PERCENT;
    if (netProfit < 0)
        return "cash_burner";
    if (isHighMargin && isHighVolume)
        return "star";
    if (isHighMargin && !isHighVolume)
        return "hidden_gem";
    if (isHighVolume && isLowMargin)
        return "illusion_bestseller";
    return null;
}
/**
 * Risk score 0–100 (higher = riskier). Used for SKU risk_score field.
 */
export function computeRiskScore(classification, marginPercent, netProfit) {
    if (classification === "cash_burner")
        return Math.min(100, 70 + Math.abs(netProfit) * 0.01);
    if (classification === "illusion_bestseller")
        return Math.min(100, 50 + Math.max(0, 5 - marginPercent));
    if (classification === "hidden_gem")
        return Math.max(0, 30 - marginPercent * 0.5);
    if (classification === "star")
        return Math.max(0, 20 - marginPercent * 0.3);
    return 50;
}
//# sourceMappingURL=sku.classifier.js.map
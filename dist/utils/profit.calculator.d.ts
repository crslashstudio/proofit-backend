/**
 * Net profit and margin calculation for orders and campaigns.
 * Used across orders, SKUs, and campaigns for consistent commerce metrics.
 */
export interface ProfitInput {
    revenue: number;
    discount: number;
    platformFee: number;
    affiliateFee: number;
    shippingCost: number;
    adsCost: number;
    cogs: number;
}
export interface ProfitResult {
    netProfit: number;
    marginPercent: number;
}
/**
 * net_profit = revenue - discount - platform_fee - affiliate_fee - shipping_cost - ads_cost - cogs
 */
export declare function calculateNetProfit(input: ProfitInput): number;
/**
 * margin_percent = (net_profit / revenue) * 100
 * Returns 0 when revenue is 0 to avoid NaN.
 */
export declare function calculateMarginPercent(netProfit: number, revenue: number): number;
/**
 * Returns both net profit and margin percentage.
 */
export declare function calculateProfit(input: ProfitInput): ProfitResult;
//# sourceMappingURL=profit.calculator.d.ts.map
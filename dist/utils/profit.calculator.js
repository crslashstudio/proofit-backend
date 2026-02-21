/**
 * Net profit and margin calculation for orders and campaigns.
 * Used across orders, SKUs, and campaigns for consistent commerce metrics.
 */
/**
 * net_profit = revenue - discount - platform_fee - affiliate_fee - shipping_cost - ads_cost - cogs
 */
export function calculateNetProfit(input) {
    return (input.revenue -
        input.discount -
        input.platformFee -
        input.affiliateFee -
        input.shippingCost -
        input.adsCost -
        input.cogs);
}
/**
 * margin_percent = (net_profit / revenue) * 100
 * Returns 0 when revenue is 0 to avoid NaN.
 */
export function calculateMarginPercent(netProfit, revenue) {
    if (revenue === 0)
        return 0;
    return (netProfit / revenue) * 100;
}
/**
 * Returns both net profit and margin percentage.
 */
export function calculateProfit(input) {
    const netProfit = calculateNetProfit(input);
    const marginPercent = calculateMarginPercent(netProfit, input.revenue);
    return { netProfit, marginPercent };
}
//# sourceMappingURL=profit.calculator.js.map
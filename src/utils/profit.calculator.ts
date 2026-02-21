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
export function calculateNetProfit(input: ProfitInput): number {
  return (
    input.revenue -
    input.discount -
    input.platformFee -
    input.affiliateFee -
    input.shippingCost -
    input.adsCost -
    input.cogs
  );
}

/**
 * margin_percent = (net_profit / revenue) * 100
 * Returns 0 when revenue is 0 to avoid NaN.
 */
export function calculateMarginPercent(netProfit: number, revenue: number): number {
  if (revenue === 0) return 0;
  return (netProfit / revenue) * 100;
}

/**
 * Returns both net profit and margin percentage.
 */
export function calculateProfit(input: ProfitInput): ProfitResult {
  const netProfit = calculateNetProfit(input);
  const marginPercent = calculateMarginPercent(netProfit, input.revenue);
  return { netProfit, marginPercent };
}

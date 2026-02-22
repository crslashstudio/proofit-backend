import { supabase } from "../../../../db/client.js";
import { env } from "../../../../config/env.js";
// Get integration from database
const getIntegration = async (workspaceId) => {
    const { data, error } = await supabase
        .from("integrations")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("channel", "tiktok")
        .eq("is_active", true)
        .single();
    if (error)
        throw new Error(error.message);
    return data;
};
// Sync orders from TikTok Shop
export const syncOrders = async (workspaceId) => {
    const integration = await getIntegration(workspaceId);
    const accessToken = integration.access_token;
    // Get date range - last 30 days
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60;
    const url = `https://open-api.tiktokglobalshop.com/order/202309/orders/search?app_key=${env.TIKTOK_APP_KEY}`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-tts-access-token": accessToken,
        },
        body: JSON.stringify({
            create_time_ge: thirtyDaysAgo,
            create_time_lt: now,
            page_size: 100,
            sort_field: "CREATE_TIME",
            sort_order: "DESC",
        }),
    });
    const rawText = await response.text();
    console.log("[tiktok/sync] Orders raw:", rawText.substring(0, 500));
    const data = JSON.parse(rawText);
    if (data.code !== 0) {
        throw new Error(`TikTok Orders API error: ${data.message}`);
    }
    const orders = data.data?.orders || [];
    console.log(`[tiktok/sync] Found ${orders.length} orders`);
    // Map and save orders to database
    for (const order of orders) {
        const revenue = parseFloat(order.payment?.original_total_product_price || "0");
        const discount = parseFloat(order.payment?.discount_total || "0");
        const shipping = parseFloat(order.payment?.shipping_fee || "0");
        const platformFee = revenue * 0.02; // estimated 2% platform fee
        const cogs = revenue * 0.4; // estimated COGS 40%
        const netProfit = revenue - discount - shipping - platformFee - cogs;
        await supabase.from("orders").upsert({
            workspace_id: workspaceId,
            channel: "tiktok",
            order_id: order.id,
            sku_id: order.line_items?.[0]?.product_id || "unknown",
            revenue,
            discount,
            platform_fee: platformFee,
            affiliate_fee: 0,
            shipping_cost: shipping,
            ads_cost: 0,
            cogs,
            net_profit: netProfit,
            order_date: new Date(order.create_time * 1000).toISOString(),
        }, { onConflict: "workspace_id,order_id" });
    }
    return { synced: orders.length };
};
// Sync products/SKUs from TikTok Shop
export const syncProducts = async (workspaceId) => {
    const integration = await getIntegration(workspaceId);
    const accessToken = integration.access_token;
    const url = `https://open-api.tiktokglobalshop.com/product/202309/products/search?app_key=${env.TIKTOK_APP_KEY}`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-tts-access-token": accessToken,
        },
        body: JSON.stringify({
            page_size: 100,
            status: "ACTIVATE",
        }),
    });
    const rawText = await response.text();
    console.log("[tiktok/sync] Products raw:", rawText.substring(0, 500));
    const data = JSON.parse(rawText);
    if (data.code !== 0) {
        throw new Error(`TikTok Products API error: ${data.message}`);
    }
    const products = data.data?.products || [];
    console.log(`[tiktok/sync] Found ${products.length} products`);
    for (const product of products) {
        await supabase.from("skus").upsert({
            workspace_id: workspaceId,
            sku_code: product.id,
            product_name: product.title,
            channel: "tiktok",
            inventory_level: product.skus?.[0]?.stock_infos?.[0]?.available_stock || 0,
            production_cost: 0,
            classification: "hidden_gem",
            risk_score: 0,
        }, { onConflict: "workspace_id,sku_code" });
    }
    return { synced: products.length };
};
//# sourceMappingURL=tiktok.sync.js.map
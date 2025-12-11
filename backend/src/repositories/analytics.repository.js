import { supabase } from "../lib/supabase.js";

export const getCreatorSalesStats = async (creatorId, options = {}) => {
  const { startDate, endDate } = options;

  let query = supabase
    .from("purchases")
    .select(`
      amount,
      platform_fee,
      creator_earnings,
      purchased_at,
      products!inner(creator_id)
    `)
    .eq("products.creator_id", creatorId)
    .eq("status", "completed");

  if (startDate) {
    query = query.gte("purchased_at", startDate);
  }

  if (endDate) {
    query = query.lte("purchased_at", endDate);
  }

  const { data, error } = await query;

  if (error) return { error };

  const stats = {
    totalRevenue: data?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0,
    totalEarnings: data?.reduce((sum, p) => sum + parseFloat(p.creator_earnings), 0) || 0,
    totalFees: data?.reduce((sum, p) => sum + parseFloat(p.platform_fee), 0) || 0,
    salesCount: data?.length || 0,
  };

  return { data: stats };
};

export const getProductSalesStats = async (productId, options = {}) => {
  const { startDate, endDate } = options;

  let query = supabase
    .from("purchases")
    .select("amount, platform_fee, creator_earnings, purchased_at")
    .eq("product_id", productId)
    .eq("status", "completed");

  if (startDate) {
    query = query.gte("purchased_at", startDate);
  }

  if (endDate) {
    query = query.lte("purchased_at", endDate);
  }

  const { data, error } = await query;

  if (error) return { error };

  const stats = {
    totalRevenue: data?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0,
    totalEarnings: data?.reduce((sum, p) => sum + parseFloat(p.creator_earnings), 0) || 0,
    salesCount: data?.length || 0,
  };

  return { data: stats };
};

export const getSalesOverTime = async (creatorId, options = {}) => {
  const { startDate, endDate, groupBy = "day" } = options;

  let query = supabase
    .from("purchases")
    .select(`
      amount,
      purchased_at,
      products!inner(creator_id)
    `)
    .eq("products.creator_id", creatorId)
    .eq("status", "completed")
    .order("purchased_at", { ascending: true });

  if (startDate) {
    query = query.gte("purchased_at", startDate);
  }

  if (endDate) {
    query = query.lte("purchased_at", endDate);
  }

  const { data, error } = await query;

  if (error) return { error };

  const groupedData = {};
  data?.forEach((purchase) => {
    const date = new Date(purchase.purchased_at);
    let key;
    
    if (groupBy === "day") {
      key = date.toISOString().split("T")[0];
    } else if (groupBy === "week") {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toISOString().split("T")[0];
    } else if (groupBy === "month") {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    }

    if (!groupedData[key]) {
      groupedData[key] = { date: key, revenue: 0, count: 0 };
    }
    groupedData[key].revenue += parseFloat(purchase.amount);
    groupedData[key].count += 1;
  });

  return { data: Object.values(groupedData) };
};

export const getTopProducts = async (creatorId, options = {}) => {
  const { startDate, endDate, limit = 5 } = options;

  let query = supabase
    .from("purchases")
    .select(`
      product_id,
      amount,
      products!inner(id, name, creator_id)
    `)
    .eq("products.creator_id", creatorId)
    .eq("status", "completed");

  if (startDate) {
    query = query.gte("purchased_at", startDate);
  }

  if (endDate) {
    query = query.lte("purchased_at", endDate);
  }

  const { data, error } = await query;

  if (error) return { error };

  const productStats = {};
  data?.forEach((purchase) => {
    const productId = purchase.product_id;
    if (!productStats[productId]) {
      productStats[productId] = {
        productId,
        name: purchase.products.name,
        revenue: 0,
        salesCount: 0,
      };
    }
    productStats[productId].revenue += parseFloat(purchase.amount);
    productStats[productId].salesCount += 1;
  });

  const sorted = Object.values(productStats)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);

  return { data: sorted };
};

export const getCreatorBalance = async (creatorId) => {
  const { data: purchases, error: purchasesError } = await supabase
    .from("purchases")
    .select(`
      creator_earnings,
      products!inner(creator_id)
    `)
    .eq("products.creator_id", creatorId)
    .eq("status", "completed");

  if (purchasesError) return { error: purchasesError };

  const totalEarnings = purchases?.reduce((sum, p) => sum + parseFloat(p.creator_earnings), 0) || 0;

  const { data: payouts, error: payoutsError } = await supabase
    .from("payouts")
    .select("amount")
    .eq("creator_id", creatorId)
    .eq("status", "completed");

  if (payoutsError) return { error: payoutsError };

  const totalPayouts = payouts?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;

  const { data: pendingPayouts, error: pendingError } = await supabase
    .from("payouts")
    .select("amount")
    .eq("creator_id", creatorId)
    .eq("status", "pending");

  if (pendingError) return { error: pendingError };

  const pendingAmount = pendingPayouts?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;

  return {
    data: {
      totalEarnings,
      totalPayouts,
      pendingPayouts: pendingAmount,
      availableBalance: totalEarnings - totalPayouts - pendingAmount,
    },
  };
};

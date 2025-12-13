import {
  getCreatorSalesStats,
  getProductSalesStats,
  getSalesOverTime,
  getTopProducts,
  getCreatorBalance,
} from "../repositories/analytics.repository.js";
import { countProductsByCreator } from "../repositories/product.repository.js";
import { countPurchasesByCreator } from "../repositories/purchase.repository.js";

export const getOverview = async (creatorId, options = {}) => {
  const [salesStats, productCount, balance] = await Promise.all([
    getCreatorSalesStats(creatorId, options),
    countProductsByCreator(creatorId),
    getCreatorBalance(creatorId),
  ]);

  if (salesStats.error) return { error: salesStats.error };
  if (balance.error) return { error: balance.error };

  return {
    data: {
      ...salesStats.data,
      productCount: productCount.count || 0,
      availableBalance: balance.data?.availableBalance || 0,
      pendingPayouts: balance.data?.pendingPayouts || 0,
    },
  };
};

export const getSalesStats = async (creatorId, options = {}) => {
  return await getCreatorSalesStats(creatorId, options);
};

export const getProductStats = async (productId, options = {}) => {
  return await getProductSalesStats(productId, options);
};

export const getSalesChart = async (creatorId, options = {}) => {
  return await getSalesOverTime(creatorId, options);
};

export const getTopSellingProducts = async (creatorId, options = {}) => {
  return await getTopProducts(creatorId, options);
};

export const getBalance = async (creatorId) => {
  return await getCreatorBalance(creatorId);
};

export const getDashboardData = async (creatorId, options = {}) => {
  const { startDate, endDate } = options;
  const dateOptions = { startDate, endDate };

  const [overview, salesChart, topProducts] = await Promise.all([
    getOverview(creatorId, dateOptions),
    getSalesChart(creatorId, { ...dateOptions, groupBy: "day" }),
    getTopSellingProducts(creatorId, { ...dateOptions, limit: 5 }),
  ]);

  if (overview.error) return { error: overview.error };

  return {
    data: {
      overview: overview.data,
      salesChart: salesChart.data || [],
      topProducts: topProducts.data || [],
    },
  };
};

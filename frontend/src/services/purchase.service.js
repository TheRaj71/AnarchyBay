import api from "../lib/api/client.js";

export const createDodoCheckout = async ({ productId, variantId, discountCode }) => {
  return await api.post("/api/purchases/checkout/dodo", {
    productId,
    variantId,
    discountCode,
  });
};

export const verifyPurchase = async (purchaseId, paymentId) => {
  const params = paymentId ? `?paymentId=${paymentId}` : "";
  return await api.get(`/api/purchases/verify/${purchaseId}${params}`);
};

export const getMyPurchases = async (page = 1, limit = 20) => {
  return await api.get(`/api/purchases/my?page=${page}&limit=${limit}`);
};

export const getPurchase = async (purchaseId) => {
  return await api.get(`/api/purchases/${purchaseId}`);
};

export const checkPurchase = async (productId) => {
  return await api.get(`/api/purchases/check/${productId}`);
};

export const getDownloadUrls = async (purchaseId) => {
  return await api.get(`/api/downloads/${purchaseId}`);
};
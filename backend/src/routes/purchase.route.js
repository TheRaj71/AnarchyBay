import { Router } from "express";
import {
  initiatePurchaseController,
  completePurchaseController,
  getPurchaseController,
  getMyPurchasesController,
  getCreatorSalesController,
  checkPurchaseController,
} from "../controllers/purchase.controller.js";
import { createDodoCheckoutController, verifyPurchaseController } from "../controllers/dodo.controller.js";
import { requireAuth, requireCreator } from "../middleware/auth.js";

const router = Router();

router.post("/initiate", requireAuth, initiatePurchaseController);
router.post("/checkout/dodo", requireAuth, createDodoCheckoutController);
router.get("/verify/:purchaseId", requireAuth, verifyPurchaseController);
router.post("/:purchaseId/complete", requireAuth, completePurchaseController);
router.get("/my", requireAuth, getMyPurchasesController);
router.get("/sales", requireAuth, requireCreator, getCreatorSalesController);
router.get("/check/:productId", requireAuth, checkPurchaseController);
router.get("/:id", requireAuth, getPurchaseController);

export default router;
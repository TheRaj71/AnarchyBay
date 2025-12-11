import { Router } from "express";
import { handleWebhookEvent, verifyWebhookSignature } from "../services/dodo.service.js";
import { logger } from "../lib/logger.js";

const router = Router();

router.post("/dodo", async (req, res) => {
  try {
    const signature = req.headers["webhook-signature"] || req.headers["x-dodo-signature"];
    const payload = req.body;
    const eventType = payload.type || payload.event_type || req.headers["x-dodo-event"];

    if (process.env.DODO_WEBHOOK_SECRET) {
      const isValid = verifyWebhookSignature(payload, signature, process.env.DODO_WEBHOOK_SECRET);
      if (!isValid) {
        logger.warn("Invalid webhook signature");
        return res.status(401).json({ error: "Invalid signature" });
      }
    }

    logger.info({ eventType, paymentId: payload.payment_id }, "Dodo webhook received");

    const result = await handleWebhookEvent(eventType, payload);

    if (result.processed) {
      logger.info({ result }, "Webhook processed successfully");
      return res.status(200).json({ received: true, ...result });
    }

    logger.warn({ result }, "Webhook not processed");
    return res.status(200).json({ received: true, ...result });
  } catch (error) {
    logger.error({ error: error.message }, "Webhook processing error");
    return res.status(500).json({ error: "Webhook processing failed" });
  }
});

router.post("/dodo/test", async (req, res) => {
  try {
    const { purchaseId } = req.body;
    
    if (!purchaseId) {
      return res.status(400).json({ error: "purchaseId required" });
    }

    const result = await handleWebhookEvent("payment.succeeded", {
      metadata: { purchase_id: purchaseId },
      payment_id: `test_${Date.now()}`,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
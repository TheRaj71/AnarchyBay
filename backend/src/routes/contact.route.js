import { Router } from 'express';
import { submitContactController, listContactsController } from '../controllers/contact.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Public endpoint to submit a contact message
router.post('/', submitContactController);

// Admin/protected listing of messages
router.get('/', requireAuth, listContactsController);

export default router;

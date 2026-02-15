import { Router, Request, Response } from 'express';
import { validateUser } from '../middleware/validateUser';
import { completePurchase } from '../services/purchaseService';

const router = Router();

router.post('/:id/purchase', validateUser, async (req: Request, res: Response) => {
  try {
    const purchase = await completePurchase(req.body.userId, req.params.id);
    res.status(201).json(purchase);
  } catch (error: any) {
    console.error('Failed to complete purchase:', error);
    const status = error.message.includes('not found') ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
});

export default router;

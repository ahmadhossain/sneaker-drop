import { Router, Request, Response } from 'express'
import { createDrop, getAllDrops } from '../services/dropService'
import { validateUser } from '../middleware/validateUser'
import { createReservation } from '../services/reservationService'

const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  try {
    const drops = await getAllDrops()
    res.json(drops)
  } catch (error) {
    console.error('Failed to fetch drops:', error)
    res.status(500).json({ error: 'Failed to fetch drops' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const drop = await createDrop(req.body)
    res.status(201).json(drop)
  } catch (error: any) {
    console.error('Failed to create drop:', error)
    res.status(400).json({ error: error.message || 'Failed to create drop' })
  }
})

router.post(
  '/:id/reserve',
  validateUser,
  async (req: Request, res: Response) => {
    try {
      const reservation = await createReservation(
        req.body.userId,
        req.params.id,
      )
      res.status(201).json(reservation)
    } catch (error: any) {
      console.error('Failed to create reservation:', error)
      const status = error.message.includes('out of stock') ? 409 : 400
      res.status(status).json({ error: error.message })
    }
  },
)

export default router

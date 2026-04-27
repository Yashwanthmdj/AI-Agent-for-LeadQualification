import { Router } from 'express'
import {
  startCall,
  bolnaWebhook,
  getLeads,
  getLeadById,
  deleteLeadById,
} from '../controllers/leadController.js'

const router = Router()

router.post('/start-call', startCall)
router.post('/webhook', bolnaWebhook)
router.get('/leads', getLeads)
router.get('/leads/:id', getLeadById)
router.delete('/leads/:id', deleteLeadById)

export default router


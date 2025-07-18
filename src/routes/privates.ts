import { verifyToken } from "../middlewares/verifyToken";
import { Router } from 'express';

const router = Router();

router.get('/dashboard', verifyToken, (req, res) => {
    res.json({ message: 'Bem-vindo ao dashboard'})
})

export default router;
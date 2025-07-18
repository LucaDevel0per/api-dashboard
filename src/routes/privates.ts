import { verifyToken } from "../middlewares/verifyToken";
import isAdmin from "../middlewares/isAdmin";
import { Router } from 'express';

const router = Router();

router.get('/dashboard', verifyToken, isAdmin, (req, res) => {
    res.json({ message: `Bem vindo ao dashboard, admin`})
})

export default router;
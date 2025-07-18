import { Router } from 'express';
import prisma from '../prisma/client';
import { verifyToken } from '../middlewares/verifyToken';
import isAdmin from '../middlewares/isAdmin';

const router = Router()

router.get('/users', verifyToken, isAdmin, async (req, res) => {
    try{

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                // password: true,
                avatarUrl: true,
                createdAt: true,
                
            }
        });
        res.json(users)
    } catch (err) {
        res.status(500).json({ erro: 'Server error' })
    }
}) 

export default router;

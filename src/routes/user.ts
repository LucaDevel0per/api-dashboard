import { Router } from 'express';
import prisma from '../prisma/client';
import { verifyToken } from '../middlewares/verifyToken';
import isAdmin from '../middlewares/isAdmin';

const router = Router()

// todos os users
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

router.get('/users/:id', verifyToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id },
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
            if (!user) {
                return res.status(404).json({ message: 'Usuário nçao encontrado'})
            }
            res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server Error'})
    }
})

export default router;

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

// get um user
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
                return res.status(404).json({ message: 'Usuário não encontrado'})
            }
            res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server Error'})
    }
})

// editar informações de um user
router.put('/users/:id', verifyToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, email, role, avatarUrl } = req.body;
    try {
        const user = await prisma.user.update({
            where: { id },
            data: { name, email, role, avatarUrl },
            select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatarUrl: true,
            createdAt: true,
            }
        });
        res.json(user);
        } catch (err) {
        res.status(404).json({ message: 'Usuário não encontrado ou erro ao atualizar.' });
        }
})

router.delete('/users/:id', verifyToken, isAdmin, async (req, res) => {
        const { id } = req.params;

        if (id === req.user.id) {
            return res.status(400).json({ message: 'Você não pode deletar a si mesmo.' })
        }

        const userToDelete = await prisma.user.findUnique({ where: { id } });

        if (!userToDelete) {
            return res.status(404).json({ message: 'User não encontrado' })
        }
        
        if ( userToDelete.role === 'admin') {
            return res.status(403).json({ message: 'Você não pode deletar outro admin.' });
        }
        try {
        await prisma.user.delete({
            where: { id }
        });
        res.json({ message: 'Usuário deletado com sucesso.' });
        } catch (err) {
        res.status(500).json({ message: 'Erro ao deletar user' });
        }
    });

export default router;

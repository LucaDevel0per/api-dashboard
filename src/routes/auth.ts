import { Router } from 'express';
import bcrypt from 'bcrypt';
import  jwt  from 'jsonwebtoken';
import prisma from '../prisma/client';

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email }});
        if (existingUser) {
            return res.status(400).json({ message: "E-mail já cadastrado." });
        }

        // criptografar senha
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        const token = jwt.sign({ id: user.id, role: user.role }, process.JWT_SECRET!, {expiresIn: '1h', 
        });

        const { password: _, ...userWithoutPassword } = user;

        return res.status(201).json({ user: userWithoutPassword, token });
    } catch (err) {
        console.log("Erro ao registar", err);
        res.status(500).json({ message: "Server Error"})
    }
})

export default router;
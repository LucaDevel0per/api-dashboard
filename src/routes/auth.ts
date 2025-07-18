import { Router } from 'express';
import bcrypt from 'bcrypt';
import  jwt  from 'jsonwebtoken';
import prisma from '../prisma/client';

import { loginSchema, registerSchema } from '../validations/authValidation';

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET

// Registro
router.post('/register', async (req, res) => {
    // VALIDAÇÃO DE DADOS
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
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

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET!, {expiresIn: '1h', 
        });

        const { password: _, ...userWithoutPassword } = user;

        return res.status(201).json({ user: userWithoutPassword, token });
    } catch (err) {
        console.log("Erro ao registar", err);
        res.status(500).json({ message: "Server Error"})
    }
})

// Login
router.post("/login", async (req, res) => {
    // VALIDAÇÃO DE DADOS
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user) {
        return res.status(404).json({ message: "User not found." })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
        return res.status(401).json({ message: "Senha incorreta." })
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
        },
        JWT_SECRET as string,
        {
            expiresIn: '1d'
        }
    )

    res.json({ token })
})

export default router;
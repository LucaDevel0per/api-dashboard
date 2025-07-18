import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('🚀 API user Dashboard rodando!')
});

app.listen(PORT, () => {
    console.log(`🚀 http://localhost:${PORT}`);
});

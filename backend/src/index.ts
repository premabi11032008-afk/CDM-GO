import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = 3001;

app.use(cors());
app.use(express.json());

// Endpoint to fetch recent query history
app.get('/api/data', async (req, res) => {
  try {
    const data = await prisma.queryHistory.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Endpoint to save new query
app.post('/api/data', async (req, res) => {
  try {
    const { query, source } = req.body;
    const newData = await prisma.queryHistory.create({
      data: {
        query,
        source: source || 'user',
      },
    });
    res.status(201).json(newData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});

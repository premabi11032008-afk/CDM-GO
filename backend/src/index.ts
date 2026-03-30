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

// Endpoint to execute raw SQL query directly on the real database
app.post('/api/execute', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'No query provided' });
    
    // Using prisma.$queryRawUnsafe to run the user's raw MySQL query
    const result = await prisma.$queryRawUnsafe(query);
    
    // Convert BigInt to string since JSON.stringify doesn't support them out of the box
    const serializedResult = JSON.parse(JSON.stringify(result, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
    res.json(serializedResult);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to execute query. Check your SQL syntax.' });
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

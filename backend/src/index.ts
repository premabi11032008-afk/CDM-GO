import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
    const { query, dbUrl } = req.body;
    if (!query) return res.status(400).json({ error: 'No query provided' });
    
    let targetDb = prisma;
    let isCustomDb = false;
    if (dbUrl && dbUrl.startsWith('mysql://')) {
       targetDb = new PrismaClient({ datasources: { db: { url: dbUrl } } });
       isCustomDb = true;
    }

    const statements = query.split(';').map((q: string) => q.trim()).filter((q: string) => q.length > 0);
    const multiResults = [];

    for (const statement of statements) {
      if (statement.toLowerCase().startsWith('use ')) {
         multiResults.push({ 
           statement, 
           error: "The 'USE' command is not supported by the query engine. Please supply your target database directly in the Custom Connection URL on the left Sidebar instead."
         });
         continue;
      }
      try {
        // Run query
        let result: any = await targetDb.$queryRawUnsafe(statement);
        
        // Hide internal tables from structural queries (like SHOW TABLES)
        if (Array.isArray(result)) {
           result = result.filter(row => {
             const lowerValues = Object.values(row).map(v => String(v).toLowerCase());
             const hidden = ['queryhistory', '_prisma_migrations', 'sys_config'];
             return !lowerValues.some(v => hidden.includes(v));
           });
        }
        
        // Save to query history
        await prisma.queryHistory.create({
          data: { query: statement, source: 'user' }
        });

        const serialized = JSON.parse(JSON.stringify(result, (key, value) =>
          typeof value === 'bigint' ? value.toString() : value
        ));
        
        // Push object wrapping the query string and its result for frontend
        multiResults.push({ statement, result: serialized });
      } catch (err: any) {
         let aiExplanation = "";
         if (process.env.GEMINI_API_KEY) {
            try {
               const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
               const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
               // Dynamically fetch the absolute live schema of the entire database to give Gemini context
               const schemaRows: any = await prisma.$queryRawUnsafe(`
                 SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE 
                 FROM INFORMATION_SCHEMA.COLUMNS 
                 WHERE TABLE_SCHEMA = DATABASE();
               `);
    
               // Filter out our internal hidden tables
               const relevantSchema = schemaRows.filter((r: any) => 
                 !['queryhistory', '_prisma_migrations', 'sys_config'].includes(r.TABLE_NAME.toLowerCase())
               );
    
               // Format into a clean string mapped by Table -> Column (Type)
               const schemaText = relevantSchema.map((r: any) => `${r.TABLE_NAME}.${r.COLUMN_NAME} (${r.DATA_TYPE})`).join(', ');

               const aiPrompt = `You are an expert SQL assistant directly hooked into a MySQL database.
The database has the following exact tables and columns you must use:
[SCHEMA START]
${schemaText}
[SCHEMA END]

The following MySQL query failed with an error.
Query: "${statement}"
Error: "${err.message}"
Explain exactly why this failed in 1-2 simple sentences and provide the corrected SQL string. Keep it concise.`;
    
               const aiRes = await model.generateContent(aiPrompt);
               aiExplanation = await aiRes.response.text();
            } catch (e) {
               console.error("AI Error Explanation failed", e);
            }
         }
         multiResults.push({ statement, error: err.message, aiExplanation });
      }
    }

    if (isCustomDb) await targetDb.$disconnect();

    res.json(multiResults);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to execute query.' });
  }
});

// Endpoint to fetch history
app.get('/api/history', async (req, res) => {
  try {
    const history = await prisma.queryHistory.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/chat', async (req, res) => {
   try {
     const { prompt } = req.body;
     if (!process.env.GEMINI_API_KEY) return res.status(400).json({ error: "No API Key configured." });
     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
     const result = await model.generateContent(`You are DataNexus, an expert AI assistant seamlessly integrated into a desktop SQL database management tool. Answer the user's question about databases, connection strings, SQL dialects, or general troubleshooting. State concisely and confidently. Do not use markdown backticks unless strictly returning code. Question: ${prompt}`);
     res.json({ reply: await result.response.text() });
   } catch (error: any) {
     res.status(500).json({ error: error.message });
   }
});

// AI Suggestion Endpoint
app.post('/api/suggest', async (req, res) => {
  try {
    const { prompt, dbUrl } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: 'GEMINI_API_KEY is missing from backend/.env' });
    }
    
    let targetDb = prisma;
    let isCustomDb = false;
    if (dbUrl && dbUrl.startsWith('mysql://')) {
       targetDb = new PrismaClient({ datasources: { db: { url: dbUrl } } });
       isCustomDb = true;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const schemaRows: any = await targetDb.$queryRawUnsafe(`
        SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE();
    `);
    const schemaText = schemaRows.map((r: any) => `${r.TABLE_NAME}.${r.COLUMN_NAME} (${r.DATA_TYPE})`).join(', ');

    const aiPrompt = `You are an expert SQL assistant for a MySQL database. 
    Schema: ${schemaText}
    User prompt: "${prompt}". 
    Return ONLY the raw SQL query string to run, without any markdown formatting, backticks, or explanation.`;
    
    const aiRes = await model.generateContent(aiPrompt);
    const resultText = aiRes.response.text();
    
    if (isCustomDb) await targetDb.$disconnect();
    
    const cleanQuery = resultText.replace(/```sql|```/g, '').trim();
    res.json({ suggestion: cleanQuery });
  } catch (error: any) {
    res.status(500).json({ error: 'AI failed: ' + error.message });
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

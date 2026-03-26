import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initial data if file doesn't exist
const initialData = {
  projects: [],
  certs: []
};

// Ensure data.json exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

// Get Data
app.get('/api/data', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// Save Data
app.post('/api/save', (req, res) => {
  try {
    const { projects, certs } = req.body;
    const newData = { projects, certs };
    fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2));
    console.log(`[${new Date().toLocaleTimeString()}] Data saved successfully! (${projects.length} projects, ${certs.length} certs)`);
    res.json({ success: true });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});

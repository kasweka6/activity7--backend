require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./db');
const recordsRouter = require('./routes/records');

const app = express();

app.use(cors());
app.use(express.json());

const STUDENT_NAME = 'Kashweka Chuumba';
const STUDENT_NUMBER = '202500032';

app.get('/', (req, res) => {
  res.json({
    project: 'CampusCare - Campus Maintenance Requests System',
    studentName: STUDENT_NAME,
    studentNumber: STUDENT_NUMBER,
    description: 'Backend API for managing campus maintenance requests.',
    routes: {
      health: '/health',
      records: '/api/records',
      singleRecord: '/api/records/:id'
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    fields: ['id', 'title', 'category', 'description', 'status']
  });
});

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'OK', database: 'Connected' });
  } catch (error) {
    res.status(503).json({
      status: 'Unavailable',
      database: 'Disconnected'
    });
  }
});

app.use('/api/records', recordsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON.' });
  }

  res.status(500).json({ error: 'Internal server error.' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CampusCare API running on port ${PORT}`);
  console.log(`Student: ${STUDENT_NAME} (${STUDENT_NUMBER})`);
});

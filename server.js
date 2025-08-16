const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const { PrismaClient } = require('./generated/prisma');
const axios = require('axios');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // assuming you stored { id: user.id } in the token
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Login
async function getBase64FromUrl(url) {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
  });
  return Buffer.from(response.data, 'binary').toString('base64');
}

app.post('/api/auth/google-login', async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Convert picture to base64 before saving
      const base64Image = await getBase64FromUrl(picture);

      user = await prisma.user.create({
        data: {
          name,
          email,
          picture: base64Image,
        },
      });

      console.log('New user saved with base64 image');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '31d' });
    res.status(200).json({ token });

  } catch (err) {
    console.error('Google Login Error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Profile Route
app.get('/api/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing token' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, picture: true },
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user });

  } catch (err) {
    console.error('Token error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// ===== GET TASKS =====
app.get('/api/tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: Number(req.userId) }
    });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// ===== POST TASK =====
app.post('/api/tasks', authMiddleware, async (req, res) => {
  const { title, created_at, due_date, priority, note, reason, status, assigned_to, priority_tags } = req.body;
  try {
    const task = await prisma.task.create({
      data: {
        title,
        created_at,
        due_date,
        priority,
        note,
        reason,
        status,
        assigned_to,
        priority_tags,
        userId: Number(req.userId)
      },
    });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create task' });
  }
});

// ===== GET QTASKS =====
app.get('/api/qtasks', authMiddleware, async (req, res) => {
  try {
    const qtasks = await prisma.qtask.findMany({
      where: { userId: Number(req.userId) }
    });
    res.json(qtasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch qtasks' });
  }
});

// ===== POST QTASK =====
app.post('/api/qtasks', authMiddleware, async (req, res) => {
  const { date, workTasks, personalTasks, assigned_by, notes, timeSpent } = req.body;
  try {
    const qtask = await prisma.qtask.create({
      data: {
        date,
        workTasks: workTasks.join(', '),
        personalTasks: personalTasks.join(', '),
        assigned_by,
        notes,
        timeSpent,
        userId: Number(req.userId)
      },
    });
    res.status(201).json(qtask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create qtask' });
  }
});

// ===== PUT TASK BY ID =====
app.put('/api/tasks/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const {
    title,
    created_at,
    due_date,
    priority,
    note,
    reason,
    status,
    assigned_to,
    priority_tags
  } = req.body;

  try {
    // Ensure task exists and belongs to the logged-in user
    const task = await prisma.task.findFirst({
      where: {
        id: id,
        userId: Number(req.userId)
      }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: id },
      data: {
        title,
        created_at,
        due_date,
        priority,
        note,
        reason,
        status,
        assigned_to,
        priority_tags
      }
    });

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ message: 'Failed to update task' });
  }
});

// ===== GET TASK BY ID =====
app.get('/api/tasks/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findFirst({
      where: { 
        id: id,
        userId: Number(req.userId)
      }
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch task' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

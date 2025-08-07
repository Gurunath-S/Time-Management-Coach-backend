// const express = require('express');
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');
// const { OAuth2Client } = require('google-auth-library');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middlewares
// app.use(cors());
// app.use(express.json());

// // Google OAuth client
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch((err) => console.error('MongoDB connection error:', err));

// // User schema and model
// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   picture: String,
// });
// const User = mongoose.model('User', userSchema);

// // Google Login Route
// app.post('/api/auth/google-login', async (req, res) => {
//   const { credential } = req.body;

//   try {
//     const ticket = await client.verifyIdToken({
//       idToken: credential,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { name, email, picture } = payload;

//     let user = await User.findOne({ email });

//     if (!user) {
//       user = await User.create({ name, email, picture });
//       console.log('New user saved:', user);
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

//     res.status(200).json({ token });
//   } catch (err) {
//     console.error('Google Login Error:', err);
//     res.status(500).json({ message: 'Login failed' });
//   }
// });

// // Profile Route (Protected)
// app.get('/api/profile', async (req, res) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) return res.status(401).json({ message: 'Missing token' });

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id).select('-__v');

//     if (!user) return res.status(404).json({ message: 'User not found' });

//     res.status(200).json({ user });
//   } catch (err) {
//     console.error('Auth Error:', err);
//     res.status(401).json({ message: 'Invalid token' });
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


// // raw code with quries 
// const express = require('express');
// const mariadb = require('mariadb');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');
// const { OAuth2Client } = require('google-auth-library');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// // Google OAuth client
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// // MariaDB pool
// const pool = mariadb.createPool({
//   host: 'localhost',
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   connectionLimit: 5,
// });

// app.post('/api/auth/google-login', async (req, res) => {
//   const { credential } = req.body;

//   try {
//     const ticket = await client.verifyIdToken({
//       idToken: credential,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { name, email, picture } = payload;

//     let conn;
//     try {
//       conn = await pool.getConnection();

//       // Check if user exists
//       const users = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
//       let user = users[0];

//       if (!user) {
//         const insertResult = await conn.query(
//           'INSERT INTO users (name, email, picture) VALUES (?, ?, ?)',
//           [name, email, picture]
//         );

//         user = {
//           id: insertResult.insertId,
//           name,
//           email,
//           picture,
//         };

//         console.log('New user saved:', user);
//       }

//       const token = jwt.sign({ id: Number(user.id) }, process.env.JWT_SECRET, { expiresIn: '1d' });

//       res.status(200).json({ token });
//     } finally {
//       if (conn) conn.release();
//     }
//   } catch (err) {
//     console.error('Google Login Error:', err);
//     console.error('DB Error:', err);
//     res.status(500).json({ message: 'Login failed' });
//   }
// });


// app.get('/api/profile', async (req, res) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) return res.status(401).json({ message: 'Missing token' });

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     let conn;
//     try {
//       conn = await pool.getConnection();

//       const users = await conn.query('SELECT id, name, email, picture FROM users WHERE id = ?', [decoded.id]);
//       const user = users[0];

//       if (!user) return res.status(404).json({ message: 'User not found' });

//       res.status(200).json({ user });
//     } finally {
//       if (conn) conn.release();
//     }
//   } catch (err) {
//     console.error('Auth Error:', err);
//     res.status(401).json({ message: 'Invalid token' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

//new code with the prisma 

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

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
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

app.post('/api/tasks', async (req, res) => {
  const { title, created_at, due_date, priority, note, reason, status, assigned_to } = req.body;

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
      },
    });
    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ message: 'Failed to create task' });
  }
});

app.post('/api/qtasks', async (req, res) => {
  const { id,date,workTasks,personalTasks,assigned_by,notes,timeSpent} = req.body;

  try {
    const qtask = await prisma.qtask.create({
      data: {
        id,         
        date,              
        workTasks:workTasks.join(', '),         
        personalTasks:personalTasks.join(', '),     
        assigned_by,       
        notes,             
        timeSpent,   
      },
    });
    res.status(201).json(qtask);
  } catch (err) {
    console.error('Error creating Qtask:', err);
    res.status(500).json({ message: 'Failed to create Qtask' });
  }
});


app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, created_at, due_date, priority, note, reason, status, assigned_to, priority_tags } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id:id },
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
      },
    });

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ message: 'Failed to update task' });
  }
});


app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

app.get("/api/qtasks",async (req,res)=>{
  try{
      const qtasks = await prisma.qtask.findMany();
      res.status(200).json(qtasks);
  }catch(err){
    console.log(err)
    res.status(500).json({message:"Failed to fecth QTasks"})
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
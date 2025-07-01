const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Define Task model with priority and dueTime
const Task = mongoose.model('Task', new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, default: 'pending' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  dueTime: { type: String }  // store as simple time string like "16:30"
}));

// ✅ Get all tasks
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// ✅ Create a new task
app.post('/api/tasks', async (req, res) => {
  const { title, priority, dueTime } = req.body;
  const newTask = await Task.create({ title, priority, dueTime });
  res.json(newTask);
});

// ✅ Update task by ID
app.put('/api/tasks/:id', async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// ✅ Delete task by ID
app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

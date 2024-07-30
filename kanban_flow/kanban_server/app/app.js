const express = require('express');
const mongoose = require('mongoose');
const Item = require('./models/itemModel');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;
const mongodbUri = process.env.MONGODB_URI;

app.use(cors());

app.use(express.json());

const createColumn = (title, items = []) => ({
  title,
  items,
});

app.get('/kanban/items', async (req, res) => {
  try {
    const items = await Item.find({});

    const groupedItems = items.reduce((acc, item) => {
      const { type, ...itemData } = item.toObject();

      if (!acc[type]) {
        acc[type] = [];
      }

      acc[type].push({
        id: item._id.toString(),
        title: itemData.title,
        description: itemData.description
      });

      return acc;
    }, {});

    const response = {
      [uuidv4()]: createColumn('Open', groupedItems['Open'] || []),
      [uuidv4()]: createColumn('Resolved', groupedItems['Resolved'] || []),
      [uuidv4()]: createColumn('Closed', groupedItems['Closed'] || []),
      [uuidv4()]: createColumn('Overdue', groupedItems['Overdue'] || [])
    };

    res.status(200).json(response);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/kanban/items', async (req, res) => {
  const { title, description, type } = req.body;
  try {
    const newItem = new Item({ title, description, type });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.log('error saving this item...', err);
    res.status(400).json({ error: err.message });
  }
});

app.put('/kanban/items/:id', async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  if (!type || !['Open', 'Overdue', 'Resolved', 'Closed'].includes(type)) {
    return res.status(400).json({ error: 'Invalid type provided' });
  }
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { type, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(updatedItem);
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

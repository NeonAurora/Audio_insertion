// server.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Set up multer to store music files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Define your schema and model
const trackSchema = new mongoose.Schema({
  title: String,
  artist: String,
  file: String,
});

const Track = mongoose.model('Track', trackSchema);

// Define API endpoints
app.post('/tracks', upload.single('file'), async (req, res) => {
  const track = new Track({
    title: req.body.title,
    artist: req.body.artist,
    file: req.file.path,
  });

  await track.save();
  res.status(201).send(track);
});

app.get('/tracks', async (req, res) => {
  const tracks = await Track.find();
  res.send(tracks);
});

// server/server.js
// ...
app.use('/uploads', express.static('uploads'));
// ...


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

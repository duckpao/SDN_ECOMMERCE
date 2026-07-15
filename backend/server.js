const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const router = require('./src/router/index');

const app = express();
const cors = require("cors");
app.use(cors()); // Cho phép mọi Frontend gọi API
connectDB();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use('/', router);

app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Avatar image is too large. Please choose an image under 10MB.' });
  }
  return next(err);
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to SDN Ecommerce API' });
});

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
  console.log(`localhost://${PORT}`);
});

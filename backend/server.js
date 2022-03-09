const path = require('path');
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const PORT = process.env.PORT || 8000;

const connectDB = require('./config/db');
const app = express();

//Connect to database
connectDB();

app.use(express.json()); //api can accept raw json form
app.use(express.urlencoded({ extended: false })); //api can accept urlEncoded form

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));

//Serve frontend
if (process.env.NODE_ENV === 'production') {
  //set frontend build folder as static
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'welcome' });
  });
}

//ErrorHandler
app.use(errorHandler);

app.listen(PORT, () => console.log('SERVER STARTED ON PORT' + PORT));

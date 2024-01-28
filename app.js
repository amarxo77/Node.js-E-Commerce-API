require('dotenv').config();
require('express-async-errors');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// middlewares
const errorHandlerMiddleware = require('./middlewares/error-handler');
const notFoundMiddleware = require('./middlewares/not-found');

// routers
const authRouter = require('./routers/auth');

// functions
const connectDB = require('./db/connect');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.get('/', (req, res) => {
  res.status(200).send('Hello There from E-Commerce API');
});

app.use('/api/auth', authRouter);

app.use('*', notFoundMiddleware);
app.use(errorHandlerMiddleware);

start();

/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Start the server */
const port = process.env.PORT ?? 7000;

async function start() {
  await connectDB();
  app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
  });
}

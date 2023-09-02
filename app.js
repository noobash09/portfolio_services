const express = require('express');
const app = express();
const morgan = require('morgan');
const portfolioRouter = require('./routes/portfolioRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Middleware
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}

app.use(express.json());

// Routes
app.use('/api/v1/portfolio',portfolioRouter);
app.use('/api/v1/user',userRouter);

app.all('*',(req,res,next) => {

    next(new AppError(`Can't find the ${req.originalUrl}`,404));

});

app.use(globalErrorHandler);

module.exports = app;
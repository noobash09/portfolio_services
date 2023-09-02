const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path : './config.env'});

process.on('uncaughtException',err => {
    console.log('UNCAUGHT EXCEPTION! Shutting Down....');
    console.log(err.name,err.message);
    process.exit(1);
});

const app = require('./app');
const port = process.env.PORT || 3000;
const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose.connect(DB,{
    useNewUrlParser : true,
    useCreateIndex:true,
    useFindAndModify:false,
}).then(con => {
    console.log("Successfully Connected to Database!!!!");
});

const server = app.listen(port,()=>{
console.log(`App is running on port ${port}...`);
});

process.on('unhandledRejection',err => {
    console.log('UNHANDLED REJECTION! Shutting Down....');
    console.log(err.name,err.message);
    server.close(()=>{
        process.exit(1);
    });
});

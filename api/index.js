import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import listingRouter from './routes/listing.route.js';
import { verifyToken } from "./controllers/auth.controller.js";
import path from "path";
import contactRoute from "./routes/contact.route.js";
import cors from "cors";
dotenv.config();
const PORT=process.env.PORT ||3000;
const app =express();
// load data from .env to process.env
app.use(cors());
mongoose.connect(process.env.MONGO).then(()=>{
    console.log('connect to MongoDB');
}).catch((err)=>{
    console.log(err);
});

//  const _dirname =path.resolve();

// app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.listen(PORT,()=>{
    console.log('Server is running on port 3000!!');
});
 
app.use("/api/user",userRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRouter);
app.use("/api/contact", contactRoute);



// app.use(express.static(path.join(_dirname,'/client/dist')));
// app.get('/*',(req,res)=>{
//     res.sendFile(path.join(_dirname,'client','dist','index.html'));
// })
    
// create middleware
// to handle error message
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    });
});

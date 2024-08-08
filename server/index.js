import {PrismaClient} from '@prisma/client'
import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import  express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();
const prisma = new PrismaClient()
const port = process.env.PORT;

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

// Error-handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode||500;
    const message = err.message||'Internal Server Error';
    return res.status(statusCode).json({ 
        success: false, 
        statusCode, 
        message,
    });
  });

  
app.listen(port, () =>{
    console.log(`Server started on port http://localhost:${port}`);
});
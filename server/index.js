import {PrismaClient} from '@prisma/client'
import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import  express from 'express';
const app = express();
const prisma = new PrismaClient()
app.use(express.json())
app.listen(8080, () =>{
    console.log('Server is running on port 8080');
}
);
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
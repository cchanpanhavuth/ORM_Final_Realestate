import {PrismaClient} from '@prisma/client'
import  express from 'express';
const app = express();
const prisma = new PrismaClient()
app.listen(3000, () =>{
    console.log('Server is running on port 3000');
}
);
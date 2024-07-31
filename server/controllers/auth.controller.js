
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
export const signup = async (req,res) =>  {
    const { username, email, password} = req.body;
    try {
        // Check if the user already exists
        const existingUser = await prisma.users.findUnique({
          where: {
            email: email,
            },
        });
    
        if (existingUser) {
          return res.status(400).json({ error: 'User already exists' });
        }
    
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create a new user in the database
        const newUser = await prisma.users.create({
          data: {
            username,
            email,
            password: hashedPassword,
          },
        });
    
        // Return success response
        res.status(201).json({ message: 'User created', user: newUser });
      } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ error: 'Internal server error' });
      }

};


  



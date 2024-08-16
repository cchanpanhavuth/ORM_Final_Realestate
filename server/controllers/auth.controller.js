import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { errorHandler } from '../utils/error.handler.js';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
export const signup = async (req, res , next) =>  {
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
        next(error);
      }

};

export const signin = async (req, res, next) => {
  const {email, password} = req.body;
  try{
      const validUser= await prisma.users.findFirst({  where: {email}})
      
      if(!validUser)return next(errorHandler(404, 'User not found'))
      const validPassowrd = bcrypt.compareSync(password, validUser.password);
      
      if(!validPassowrd) return next(errorHandler(401, 'Wrong credentials'));
      const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET )
      
      const {password: pass, ...others} = validUser;
      res.cookie('token', token, {httpOnly: true
          // add cookie expire
          // , expires: new Date(Date.now() + 1000 * 60 * 60 * 24)
          })
          .status(200)
          .json(others);
  }catch(error){
      next(error);
  }


}

export const google = async (req, res, next) => {
  try{
    const user = await prisma.users.findFirst({  where: {email: req.body.email}})
    
    if (user){
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET )
      const {password: pass, ...others} = user;
      res.cookie('token', token, {httpOnly: true})
          .status(200)
          .json(others);
    } else {
      const genPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
      const hashPassword = bcrypt.hashSync(genPassword, 10)
      const newUser = await prisma.users.create({
        data: {
          username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
          email: req.body.email,
          password: hashPassword,
          avatar: req.body.photo
        }
      })
      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET )
        const {password: pass, ...others} = newUser;
        res.cookie('token', token, {httpOnly: true})
            .status(200)
            .json(others)
      
    }

    }catch(error){
      next(error)
    }
}

export const signOut = (req, res) => {
  try{
  res.clearCookie('token')
  res.status(200).json('User has been logged out')
  }catch(error){
    next(error)
  }
}




  



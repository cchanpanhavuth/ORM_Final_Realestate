import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../utils/error.handler.js"
import bcrypt from 'bcrypt'

const prisma = new PrismaClient();

export const test = (req,res) =>{
    res.send('Hello Guys')
}

export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.id){ 
        return next(errorHandler(401, "You can only update your own account!"))
    }
    try{
        if(req.body.password){
            req.body.password = bcrypt.hashSync(req.body.password, 10)
        }

        const updatedUser = await prisma.users.update({
            where: { id: req.params.id },
            data: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        });
        const {password, ...others} = updatedUser

        res.status(200).json(others)
    }catch(error){
        next(error)
    }
};

export const deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.id){ 
        return next(errorHandler(401, "You can only delete your own account!"))
    }
    try{
        await prisma.users.delete({
            where: { id: req.params.id }
        })
        res.clearCookie('token')
        res.status(200).json('User has been deleted')
    }catch(error){
        next(error)
    }
}

export const getUserProperty = async (req, res, next) => {
    if (req.user.id === req.params.id) {
      try {
        // Use 'findUnique' for a single property
        const property = await prisma.property.findMany({
          where: { userId: req.params.id },
        });
  
        if (!property) {
          return next(errorHandler(404, 'Property not found'));
        }
  
        res.status(200).json(property);
      } catch (error) {
        next(error);
      }
    } else {
      return next(errorHandler(401, 'You can only view your own properties!'));
    }
  };
  
  export const getUser = async (req, res, next) => {
    try {
      // Fetch user data by ID
      const user = await prisma.users.findUnique({
        where: { id: req.params.id },
      });
  
      if (!user) return next(errorHandler(404, 'User not found!'));
  
      // Exclude the password field
      const { password, ...rest } = user;
  
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };
  



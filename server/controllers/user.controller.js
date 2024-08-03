import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../utils/error.handler.js"
import bcrypt from 'bcrypt'

const prisma = new PrismaClient();

export const test = (req,res) =>{
    res.send('Hello Guyssss')
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

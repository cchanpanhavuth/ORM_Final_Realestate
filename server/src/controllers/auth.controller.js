import bcrypt from 'bcrypt';
import primsa from '../db.js';
import {errorHandler} from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signin = async (req, res, next) => {
    const {email, password} = req.body;
    try{
        const validUser= await primsa.user.findOne({  where: {email}})
        if(!validUser)return next(errorHandler(404, 'User not found'))
        const validPassowrd = bcrypt.compareSync(password, validUser.password);
        if(!validPassowrd) return next(errorHandler(401, 'Wrong credentials'));
        const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET )
        const {password: pass, ...others} = validUser.dataValues;
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
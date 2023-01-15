import UserModel from "../module/user.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {validationResult} from "express-validator";


export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const password = req.body.password.toString();
        const salt = await bcryptjs.genSalt(10); //code password
        const hash = await bcryptjs.hash(password, salt); //code password


        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        }) // create user post

        const user = await doc.save(); // save user in server

        const token = jwt.sign({
                _id: user._id,
            },
            'hunter15021984', // secret code
            {expiresIn: '30d'}, // time life token 30 days
        )

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData, token
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Problem Auth bad"
        })
    }
}


export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email})
        if (!user) {
            return res.status(404).json({
                message: 'Error, user not found'
            })
        }
        const isValidPass = await bcryptjs.compareSync(req.body.password, user._doc.passwordHash) // only string

        if (!isValidPass) {
            return res.status(403).json({
                message: 'Error, password or email wrong' // check in errors, password or email
            })
        }
        const token = jwt.sign({
                _id: user._id,
            },
            'hunter15021984', // secret code
            {expiresIn: '30d'}, // time life token 30 days
        )

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData, token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "No Auth, sorry error....",
        });
    }
}

export const userMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            })
        }
        const {passwordHash, ...userData} = user._doc;

        res.json({...userData})
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "what`s wrong"
        })
    }
}
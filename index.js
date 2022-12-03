import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import {loginValidation, postCreateValidation, registerValidation} from "./validation/auth.js";
import checkAuth from "./utils/checkAuth.js";
import * as userController from './controllers/userController.js';
import * as postController from './controllers/postController.js'

mongoose
    .connect('mongodb+srv://YevhenRight:Hunter15021984@cluster0.uwwhu0y.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log("DB ok"))
    .catch((err) => console.log('DB err', err))


const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, "uploads")
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
});

const  upload = multer({storage});


app.use(express.json());
app.use('/uploads', express.static('uploads')); //TODO important strict

app.get('/', (req, res) => {
    res.send('Hello world!!!')
})
app.post('/auth/login', loginValidation, userController.login);
app.post('/auth/register', registerValidation, userController.register);
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
});
app.get('/auth/me', checkAuth, userController.userMe);
app.post('/posts', checkAuth, postCreateValidation, postController.create);
app.get('/posts', postController.getAll);
app.get('/posts/:id', postController.getOne);
app.patch('/posts/:id', checkAuth, postController.update);
app.delete('/posts/:id', checkAuth, postController.remove);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log("Server Ok")
})


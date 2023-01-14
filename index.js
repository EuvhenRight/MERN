import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import {loginValidation, postCreateValidation, registerValidation} from "./validation/auth.js";
import checkAuth from "./utils/checkAuth.js";
import * as userController from './controllers/userController.js';
import * as postController from './controllers/postController.js'

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("DB ok"))
    .catch((err) => console.log('DB err', err))


const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, "upload")
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
});

const  upload = multer({storage});


app.use(express.json());
app.use('/upload', express.static('upload')); //TODO important strict

app.get('/', (req, res) => {
    res.send('Hello world!!!')
})
app.post('/auth/login', loginValidation, userController.login);
app.post('/auth/register', registerValidation, userController.register);
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/upload/${req.file.originalname}`,
    })
});
app.get('/tags', postController.getLastTags);
app.get('/auth/me', checkAuth, userController.userMe);
app.post('/posts', checkAuth, postCreateValidation, postController.create);
app.get('/posts/tags', postController.getLastTags);
app.get('/posts', postController.getAll);
app.get('/posts/:id', postController.getOne);
app.patch('/posts/:id', checkAuth, postController.update);
app.delete('/posts/:id', checkAuth, postController.remove);

app.listen( process.env.PORT || 4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log("Server Ok")
})


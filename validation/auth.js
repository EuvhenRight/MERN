import {body} from "express-validator";


export const loginValidation = [
    body('email', 'wrong email').isEmail(),
    body('password', 'wrong password').isLength({min: 5}),
];

export const registerValidation = [
    body('email', 'wrong email').isEmail(),
    body('password', 'wrong password').isLength({min: 5}),
    body('fullName', 'not correct name').isLength({min: 3}),
    body('avatarUrl', 'not correct avatar').optional().isURL(),
];

export const postCreateValidation = [
    body('text', 'enter article title').isLength({min: 3}).isString(),
    body('title', 'enter text title').isLength({min: 10}).isString(),
    body('tags', 'enter correct format tags, enter array ').optional().isArray(),
    body('imageUrl', 'failed link image').optional().isString(),
];
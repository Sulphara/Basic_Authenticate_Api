import { Router } from "express";
import * as userController from '../controller/userController';
import { privateRoute } from '../config/passport'


export const route = Router();

route.post('/register', userController.register)
route.post('/login', userController.login)

route.get('/list', privateRoute, userController.list)

  
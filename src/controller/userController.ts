import { PrismaClient } from "@prisma/client";
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { generateToken } from '../config/passport'

dotenv.config();

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  if (req.body.email && req.body.password) {
    let { email, password } = req.body;

    let hasUser = await prisma.user.findUnique({
      where: { email }
    })
    if (!hasUser) {
      let newUser = await prisma.user.create({
        data: {
          email,
          password
        }
      });
      const token = generateToken({ id: newUser.id })



      return res.status(201).json({ id: newUser.id, token })

    } else {
      return res.status(200).json({ error: "E-mail já existente!" })
    }
  } else {
    return res.status(200).json({ error: "e-mail e/ou senha não enviados." })
  }
}

export const login = async (req: Request, res: Response) => {
  if (req.body.email && req.body.password) {

    let email: string = req.body.email;
    let password: string = req.body.password;

    let user = await prisma.user.findFirst({
      where: {
        email,
        password
      }
    });

    if (user) {
      const token = generateToken({ id: user.id })
      return res.status(200).json({ status: true, token })
    }


  };
  return res.status(200).json({ status: false })
}

export const list = async (req: Request, res: Response) => {
  let users = await prisma.user.findMany();
  let list: string[] = [];

  for (let i in users) {
    list.push(users[i].email)
  }

  return res.status(200).json({ list })

}
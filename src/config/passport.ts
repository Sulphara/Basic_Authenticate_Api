import { Request, Response, NextFunction } from 'express'
import passport from "passport";
import dotenv from 'dotenv';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { PrismaClient } from "@prisma/client";
import JWT from 'jsonwebtoken';




const prisma = new PrismaClient()
dotenv.config();

const notAuthJson = { status: 401, message: 'Não autorizado' }

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string
}

passport.use(new JWTStrategy(options, async (payload, done) => {
  const user = await prisma.user.findFirst({
    where: { id: payload.id }
  });
  if (user) {
    return done(null, user)
  } else {
    return done(notAuthJson, false)
  }
}));

export const generateToken = (data: object) => {
  return JWT.sign(data, process.env.JWT_SECRET as string);
}

export const privateRoute = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', (err, user) => {
    req.user = user;
    return user ? next() : next(notAuthJson);
  })(req, res, next);
}




export default passport;

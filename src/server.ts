import express, { ErrorRequestHandler, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import * as apiRoutes from './routes/api';


dotenv.config();

const server = express();

server.use(express.json())
server.use(cors());
server.use(passport.initialize());
server.use(apiRoutes.route)


server.use((req: Request, res: Response) => {
  res.status(404).json({ Error: "Nenhuma página localizada" })
})

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status)
  } else {
    res.status(400);
  }
  if (err.message) {
    res.json({ error: err.message })
  } else {
    res.json({ error: 'Ocorreu algum erro.' })
  }
};

server.use(errorHandler);

server.listen(process.env.PORT, () => {
  console.log("Server is running")
})

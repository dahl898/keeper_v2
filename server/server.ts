import * as dotenv from 'dotenv';
dotenv.config();
import express, {Express, Request, Response} from 'express'
const app: Express = express();
import cors from 'cors';
import connection from './database/config';
import {TNote, TAccount, TUser} from './interfaces';
import crypto from 'crypto';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { auth } from './middlewares/middlewares';
import { genPassword } from './utils/authFunctions';
import path from 'path';

const Account = connection.models.Account;
const User = connection.models.User;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: `${process.env.SECRET}`,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({mongoUrl: process.env.MONGOURL}),
  cookie: {
    maxAge: 1000 * 60 * 60,
    httpOnly: false //if set to false, then browser can read a cookie sent from the server (not safe)
  }
}))

import './passport/config'

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.resolve(__dirname, '../../client/build')));

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../../client/build'))
});

app.get('/api', auth, async (req: Request, res: Response) => {
    const doc: TAccount | null = await Account.findOne({username: req.user?.username})
    if (doc) {
      res.send(JSON.stringify(doc?.notes))
    }else{
      res.send(JSON.stringify([]))
    }
    
}); 

app.get('/login', auth, (req: Request, res: Response) => {
  res.send(JSON.stringify({isAuth: true}))
})

app.post('/login', passport.authenticate('local', {successRedirect: 'login-success', failureRedirect: 'login-failure'}), (req: Request, res: Response) => {})

app.post('/register', async (req: Request, res: Response) => {
  const exUser: TUser | null = await User.findOne({username: req.body.username})
  if (exUser) {
    res.send(JSON.stringify({isAuth: false, msg: true}))
  }else{
    const saltHash = genPassword(req.body.password)
    const user = new User <TUser>({
      username: req.body.username,
      hash: saltHash.hash,
      salt: saltHash.salt
    })
    await user.save()
    res.send(JSON.stringify({isReg: true}))
  }
});

app.get('/login-success', (req: Request, res: Response) => {
  res.send(JSON.stringify({isAuth: true}))
})

app.get('/login-failure', (req: Request, res: Response) => {
  res.send(JSON.stringify({iaAuth: false, failed: true}))
})

app.get('/logout', async (req: Request, res: Response) => {
  req.logout((err) => {
    if(err){
    res.send(JSON.stringify({logout: false}))
  }else{
    res.send(JSON.stringify({logout: true}))
  }
  })
});

app.post('/api', async (req: Request, res: Response): Promise<void> => {
  const id = crypto.randomBytes(16).toString('hex')
  const data: TNote = await {...req.body, _id: id}
  const exAccount: TAccount | null = await Account.findOneAndUpdate({username: req.user?.username}, {$push: {notes: data}})
  if (exAccount){
    res.send(JSON.stringify(data));
  }else{
    const account = new Account<TAccount>({
      username: req.user?.username,
      notes: [{
        _id: id,
        title: req.body.title,
        content: req.body.content
      }]
    })
    await account.save()
    res.send(JSON.stringify(data));
  }
});

app.delete('/api', async (req: Request, res: Response) => {
  const result = await Account.findOneAndUpdate({username: req.user?.username}, {$pull: {notes: {_id: req.body._id}}});
  res.send();
});

const port = process.env.PORT
app.listen(port || 5000, () => {
  console.log(`[server]: Listening on port ${port || 5000}`)
})






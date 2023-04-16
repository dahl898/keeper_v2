import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import connection from '../database/config';
import { TUser } from '../interfaces'; 
import crypto from 'crypto';
import { validPassword } from '../utils/authFunctions';

const User = connection.models.User;

declare global {
  namespace Express {
    interface User {
      username: string;
      _id?: string;
    }
  }
} // without it serializeUser function throws an error because input value of user is by default Express.User, so you cannot define what of your custom properties like 'username' must be in req.session.passport.user object without a type error, because those do not exist on Express.User object. This declaration extends Express.User property by '_id' and 'username' property, so I can use them later when I define what properties must be in req.session.passport.user object. It's done by declaration merging.



passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({username: username})
    .then((user: TUser) => {
      if (!user){
        return done(null, false);
      }
      const isValid = validPassword(password, user.hash, user.salt);
      if (isValid){
        return done(null, user)
      }else{
        return done(null, false)
      }
    })
    .catch((err: Error) => {
      return done(err);
    })
    }
))


passport.serializeUser(function(user, cb){
  process.nextTick(function(){
    cb(null, {username: user.username, id: user._id})
  })
})

passport.deserializeUser(function(user: TUser, cb){
  process.nextTick(function(){
    return cb(null, user)
  })
})
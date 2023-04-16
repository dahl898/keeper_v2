import mongoose, { Schema, model, createConnection } from 'mongoose';
import {TAccount, TUser} from '../interfaces'

const accountSchema = new Schema<TAccount>({
  username: String,
  notes: [{
    _id: String,
    title: String,
    content: String,
  }]
})

const userSchema = new Schema<TUser>({
  username: String,
  hash: String,
  salt: String
})

const connection = createConnection(`${process.env.MONGOURL}`);

const Account = connection.model<TAccount>('Account', accountSchema)
const User = connection.model<TUser>('User', userSchema)


export default connection


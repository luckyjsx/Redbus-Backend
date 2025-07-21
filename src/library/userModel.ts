import mongoose, { Document, Schema } from 'mongoose';
import { User } from '../types';

export interface IUser extends User, Document {}

const UserSchema: Schema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model<IUser>('User', UserSchema);
export default UserModel; 
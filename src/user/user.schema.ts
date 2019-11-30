import { Schema, Document, model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import mongoosePaginate from "mongoose-paginate-v2";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  age: string;
  phone: string;
  email: string;
  password: string;
}

const User = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },

  phone: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true,
  },

}, { timestamps: true});

User.pre("save", function(this: any, next)  {
  if(!this.isModified("password")) {
      return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

User.methods['comparePassword'] = function(plaintext, callback) {
  return callback(null, bcrypt.compareSync(plaintext, this.password));
};

User.plugin(mongoosePaginate);

export default model('User', User);
import { Schema, Document, model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import mongoosePaginate from "mongoose-paginate-v2";
import bookSchema, { IBook } from '../book/book.schema';

type CustomMethods = {
  comparePassword
}
export interface IUser extends Document, CustomMethods {
  firstName: string;
  lastName: string;
  age: string;
  phone: string;
  email: string;
  password: string;
  favoriteBooks?: string[];
}

const User = new Schema<IUser & CustomMethods>({
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

  favoriteBooks: [{
    type: Schema.Types.ObjectId,
    ref: 'Book'
  }]

}, { timestamps: true, toJSON: { virtuals: true }});

User.pre("save", function(this: any, next)  {
  if(!this.isModified("password")) {
      return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

User.pre("remove", function(next) {
  bookSchema
    .update(
      { usersFavorites: this._id },
      { $pull: { usersFavorites: this._id } },
      { multi: true }
    ) //if reference exists in multiple documents
    .exec();
  next();
});

User.methods.comparePassword = function(plaintext, callback) {
  return bcrypt.compare(plaintext, this.password);
};

User.plugin(mongoosePaginate);

export default model('User', User);
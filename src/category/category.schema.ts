import { Schema, Document, model } from "mongoose";
import * as bcrypt from "bcrypt";
import mongoosePaginate from "mongoose-paginate-v2";
import bookSchema from "../book/book.schema";

export interface ICategory extends Document {
  title: string;
  description?: string;
  books?: string[];
}

const Category = new Schema<ICategory>(
  {
    title: {
      type: String,
      unique: true,
      required: true
    },

    description: {
      type: String,
      required: false
    },

    books: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book"
      }
    ]
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

Category.pre("remove", function(next) {
  bookSchema
    .update(
      { categories: this._id },
      { $pull: { categories: this._id } },
      { multi: true }
    ) //if reference exists in multiple documents
    .exec();
  next();
});

Category.plugin(mongoosePaginate);

export default model("Category", Category);

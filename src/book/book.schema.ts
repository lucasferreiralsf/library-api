import { Schema, Document, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import categorySchema from "../category/category.schema";
import userSchema from "../user/user.schema";

export interface IBook extends Document {
  title: string;
  isbn: string;
  year: Date;
  categories: string;
  usersFavorites?: string[];
}

const Book = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true
    },

    isbn: {
      type: String,
      unique: true,
      required: true
    },

    year: {
      type: String,
      required: true
    },

    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category"
      }
    ],

    usersFavorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

Book.pre("remove", function(next) {
  categorySchema
    .update(
      { books: this._id },
      { $pull: { books: this._id } },
      { multi: true }
    ) //if reference exists in multiple documents
    .exec();
  userSchema
    .update(
      { favoriteBooks: this._id },
      { $pull: { favoriteBooks: this._id } },
      { multi: true }
    ) //if reference exists in multiple documents
    .exec();
  next();
});

// Book.pre("save", function(next) {
//   categorySchema
//     .updateOne(
//       { books: this._id },
//       { $set: { books: this._id } },
//       // { multi: true }
//     ) //if reference exists in multiple documents
//     .exec();
//   next();
// })

Book.plugin(mongoosePaginate);

export default model("Book", Book);

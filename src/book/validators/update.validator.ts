import { check } from "express-validator";
import userSchema from "../../user/user.schema";
import { HttpError } from "../../common/errors";
import { isDate } from 'date-fns';
import bookSchema from "../book.schema";

export const updateBookValidator = [
  check([
    "title",
    "isbn",
    "year",
    "categories",
    "usersFavorites"
  ]).optional({ nullable: false }),
  check(["isbn"])
    .isISBN()
    .custom(async isbn => {
      const book = await bookSchema.findOne({ isbn });
      if (book) throw new HttpError("Book already exists.", 400);
    }),
  check(["year"]).isString(),
];

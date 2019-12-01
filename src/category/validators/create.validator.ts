import { check } from "express-validator";
import { HttpError } from "../../common/errors";
import categorySchema from "../category.schema";

export const createCategoryValidator = [
  check([
    "description",
    "books",
  ]).optional({ nullable: false }),
  check([
    "title",
  ]).notEmpty({ ignore_whitespace: true }),
  check(["title"]).isString().custom(async title => {
    const category = await categorySchema.findOne({ title });
    if (category) throw new HttpError("Category already exists.", 400);
  }),
];

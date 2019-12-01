import { check } from "express-validator";
import categorySchema from "../category.schema";
import { HttpError } from "../../common/errors";
import { isDate } from 'date-fns';

export const updateCategoryValidator = [
  check([
    "title",
    "description",
    "books",
  ]).optional({ nullable: false }),
  check(["title"]).custom(async title => {
    const category = await categorySchema.findOne({ title });
    if (category) throw new HttpError("Category already exists.", 400);
  })
];

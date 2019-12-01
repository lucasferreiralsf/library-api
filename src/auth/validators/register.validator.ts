import { check } from "express-validator";
import userSchema from "../../user/user.schema";
import { HttpError } from "../../common/errors";

export const registerValidator = [
  check([
    "firstName",
    "lastName",
    "password",
    "age",
    "phone",
    "email"
  ]).notEmpty({ ignore_whitespace: true }),
  check(["phone"])
    .isMobilePhone("pt-BR")
    .custom(async phone => {
      const user = await userSchema.findOne({ phone });
      if (user) throw new HttpError("Phone already in use", 400);
    }),
  check(["email"])
    .isEmail()
    .custom(async email => {
      const user = await userSchema.findOne({ email });
      if (user) throw new HttpError("E-mail already in use", 400);
    }),
  check(["age"]).isInt(),
];

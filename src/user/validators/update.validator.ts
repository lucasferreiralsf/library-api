import { check } from "express-validator";
import userSchema from "../../user/user.schema";
import { HttpError } from "../../common/errors";

export const updateUserValidator = [
  check([
    "firstName",
    "lastName",
    "password",
    "age",
    "phone",
    "email"
  ]).optional({ nullable: false }),
  check(["phone"])
    .isMobilePhone("pt-BR"),
  check(["email"])
    .isEmail(),
  check(["age"]).isInt(),
];

import { check } from "express-validator";

export const loginValidator = [
  check([
    "password",
    "email"
  ]).notEmpty({ ignore_whitespace: true }),
  check(["email"])
    .isEmail()
];

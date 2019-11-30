import { validationResult } from "express-validator";
import { UserController } from "./user/user.controller";
import { loginValidator } from "./auth/validators/login.validator";
import { AuthController } from "./auth/auth.controller";
import { registerValidator } from "./auth/validators/register.validator";

function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  return next();
}

const authRoutes = [
  {
    method: "post",
    route: "/auth",
    criteria: loginValidator,
    validate: validate,
    controller: AuthController,
    action: "login"
  },
  {
    method: "post",
    route: "/auth/register",
    criteria: registerValidator,
    validate: validate,
    controller: AuthController,
    action: "register"
  },
  {
    method: "delete",
    route: "/auth/:id",
    controller: AuthController,
    action: "deleteAccount"
  }
];

const userRoutes = [
  {
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all"
  },
  {
    method: "get",
    route: "/users/:id",
    auth: true,
    controller: UserController,
    action: "one"
  },
];

export const Routes: {
  method: string;
  route: string;
  controller: any;
  action: string;
  auth?: boolean;
  criteria?: any;
  validate?: any;
}[] = [...userRoutes, ...authRoutes];

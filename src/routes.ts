import { validationResult } from "express-validator";
import { UserController } from "./user/user.controller";
import { loginValidator } from "./auth/validators/login.validator";
import { AuthController } from "./auth/auth.controller";
import { registerValidator } from "./auth/validators/register.validator";
import { updateUserValidator } from "./user/validators/update.validator";
import { BookController } from "./book/book.controller";
import { createBookValidator } from "./book/validators/create.validator";
import { updateBookValidator } from "./book/validators/update.validator";
import { CategoryController } from "./category/category.controller";
import { createCategoryValidator } from "./category/validators/create.validator";
import { updateCategoryValidator } from "./category/validators/update.validator";

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
];

const userRoutes = [
  {
    method: "get",
    route: "/user",
    controller: UserController,
    action: "all"
  },
  {
    method: "get",
    route: "/user/:id",
    auth: true,
    controller: UserController,
    action: "one"
  },
  {
    method: "put",
    route: "/user/:id",
    auth: true,
    criteria: updateUserValidator,
    validate: validate,
    controller: UserController,
    action: "update"
  },
  {
    method: "post",
    route: "/user/favorite/:id",
    auth: true,
    controller: UserController,
    action: "favoriteBook"
  },
  {
    method: "delete",
    route: "/user/:id",
    auth: true,
    controller: UserController,
    action: "deleteAccount"
  }
];

const bookRoutes = [
  {
    method: "get",
    route: "/book",
    controller: BookController,
    action: "all"
  },
  {
    method: "get",
    route: "/book/:id",
    controller: BookController,
    action: "one"
  },
  {
    method: "post",
    route: "/book",
    auth: true,
    criteria: createBookValidator,
    validate: validate,
    controller: BookController,
    action: "create"
  },
  {
    method: "put",
    route: "/book/:id",
    auth: true,
    criteria: updateBookValidator,
    validate: validate,
    controller: BookController,
    action: "update"
  },
  {
    method: "delete",
    route: "/book/:id",
    auth: true,
    controller: BookController,
    action: "delete"
  }
]

const categoryRoutes = [
  {
    method: "get",
    route: "/category",
    controller: CategoryController,
    action: "all"
  },
  {
    method: "get",
    route: "/category/:id",
    controller: CategoryController,
    action: "one"
  },
  {
    method: "post",
    route: "/category",
    auth: true,
    criteria: createCategoryValidator,
    validate: validate,
    controller: CategoryController,
    action: "create"
  },
  {
    method: "put",
    route: "/category/:id",
    auth: true,
    criteria: updateCategoryValidator,
    validate: validate,
    controller: CategoryController,
    action: "update"
  },
  {
    method: "delete",
    route: "/category/:id",
    auth: true,
    controller: CategoryController,
    action: "delete"
  }
]

export const Routes: {
  method: string;
  route: string;
  controller: any;
  action: string;
  auth?: boolean;
  criteria?: any;
  validate?: any;
}[] = [...userRoutes, ...authRoutes, ...bookRoutes, ...categoryRoutes];

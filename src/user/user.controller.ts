import { NextFunction, Request, Response } from "express";
import User from "./user.schema";
import * as bcrypt from "bcrypt";

export class UserController {
  // private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    const page = request.query.page;
    const limit = request.query.limit;

    const users = await User.find(null, null, {
      skip: page,
      take: limit,
      select: [
        "id",
        "firstName",
        "lastName",
        "age",
        "email",
        "phone",
        "createdAt",
        "updatedAt"
      ],

    });
    return users;
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const user = await User.findOne(request.params.id);
    user.password = undefined;
    return user;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const user = request.body;
    return await User.create(request.body);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    return await User.findOneAndRemove({ _id: request.params.id});
  }
}

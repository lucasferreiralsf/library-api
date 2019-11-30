import { NextFunction, Request, Response } from "express";
import User from "./user.schema";
import * as bcrypt from "bcrypt";
import { HttpError } from "../common/errors";

export class UserController {
  // private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    const page = request.query.page || 1;
    const limit = request.query.limit || 10;

    const users = await User.paginate({}, {page, limit, select: '-password'});
    return users;
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const user = await User.findOne(request.params.id);
    user.password = undefined;
    return user;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      return await User.create(request.body);
      
    } catch (error) {
      next(new HttpError(error, 400));
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    return await User.findOneAndRemove({ _id: request.params.id});
  }
}

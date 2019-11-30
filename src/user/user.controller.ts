import { NextFunction, Request, Response } from "express";
import User from "./user.schema";
import { HttpError } from "../common/errors";

export class UserController {

  async all(request: Request, response: Response, next: NextFunction) {
    const page = request.query.page || 1;
    const limit = request.query.limit || 10;

    response.json(await User.paginate({}, {page, limit, select: '-password'}));
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const user = await User.findOne({_id: request.params.id});
    user.password = undefined;
    response.json(user);
  }
}

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

import User, { IUser } from "../user/user.schema";
import { HttpError } from "../common/errors";
import config from "../config";

export class AuthController {
  // private userRepository = getRepository(User);

  async register(request: Request, response: Response, next: NextFunction) {
    try {
      response.status(201).json(await User.create(request.body));
    } catch (error) {
      next(new HttpError(error, 400));
    }
  }

  async passwordRecovery(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const user = await User.findOne(request.params.id);
    user.password = undefined;
    response.json(user);
  }

  async login(request: Request, response: Response, next: NextFunction) {
    // try {
      const user: IUser = await User.findOne({email: request.body.email});
      if(!user) {
        response.status(404).json({});
      }

      const { email, firstName, lastName, age, phone } = user;

      if(await user.comparePassword(request.body.password)) {
        const token = jwt.sign({email}, config.secretKey);
        response.status(200).json({
          firstName,
          lastName,
          age,
          phone,
          token
        });
      }
    // } catch (error) {
    //   next(new HttpError(error, 400));
    // }
  }

  async deleteAccount(request: Request, response: Response, next: NextFunction) {
    response.json(await User.findOneAndRemove({ _id: request.params.id }));
  }
}

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

  async login(request: Request, response: Response, next: NextFunction) {
    // try {
      const user: IUser = await User.findOne({email: request.body.email});
      if(!user) {
        response.status(404).json({});
      }

      const { email, firstName, lastName, age, phone, favoriteBooks } = user;

      if(await user.comparePassword(request.body.password)) {
        const token = jwt.sign({email}, config.secretKey, { expiresIn: '2h'});
        response.status(200).json({
          firstName,
          lastName,
          age,
          phone,
          favoriteBooks,
          token
        });
      } else {
        next(new HttpError('Email or password invalid.', 401));
      }
    // } catch (error) {
    //   next(new HttpError(error, 400));
    // }
  }
}

import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { IUser } from "./user.schema";
import { HttpError } from "../common/errors";
import bookSchema from "../book/book.schema";

export class UserController {
  async all(request: Request, response: Response, next: NextFunction) {
    const page = request.query.page || 1;
    const limit = request.query.limit || 10;

    response.json(
      await User.paginate(
        {},
        {
          page,
          limit,
          select: "-password",
          populate: [{ path: "favoriteBooks", select: "title" }]
        }
      )
    );
  }

  async one(
    request: Request & { user: IUser },
    response: Response,
    next: NextFunction
  ) {
    if (request.params.id !== request.user._id.toString()) {
      next(new HttpError("Not authorized", 401));
    } else {
      const user = await User.findOne({ _id: request.user._id }).populate(
        "favoriteBooks"
      );
      user.password = undefined;
      response.json(user);
    }
  }

  async favoriteBook(
    request: Request & { user: IUser },
    response: Response,
    next: NextFunction
  ) {
    const user = await User.findOneAndUpdate(
      { _id: request.user._id },
      { $push: { favoriteBooks: request.params.id } },
      {
        new: true,
        runValidators: true
      }
    ).populate("favoriteBooks", "title");

    if (user) {
      await bookSchema.updateOne(
        { _id: request.params.id },
        { $push: { usersFavorites: user._id } }
      );
      response.status(201).json(user);
    } else {
      next(new HttpError("Not Found.", 404));
    }
  }

  async update(
    request: Request & { user: IUser },
    response: Response,
    next: NextFunction
  ) {
    if (request.params.id !== request.user._id.toString()) {
      next(new HttpError("Not authorized", 401));
    } else {
      if (request.body.password)
        request.body.password = bcrypt.hashSync(request.body.password, 10);
      const user = await User.findOneAndUpdate(
        { _id: request.user._id },
        request.body,
        {
          new: true,
          runValidators: true
        }
      ).populate("favoriteBooks", "title");
      if (user) {
        if (request.body.favoriteBooks.length > 0) {
          request.body.favoriteBooks.map(async book => {
            await bookSchema.updateOne(
              { _id: book },
              { $push: { usersFavorites: user._id } }
            );
          });
        }

        response.status(201).json(user);
      } else {
        next(new HttpError("Not Found.", 404));
      }
    }
  }

  async deleteAccount(
    request: Request & { user: IUser },
    response: Response,
    next: NextFunction
  ) {
    try {
      if (request.params.id !== request.user._id.toString()) {
        next(new HttpError("Not authorized", 401));
      } else {
        response
          .status(200)
          .json(await User.findOneAndRemove({ _id: request.user._id }));
      }
    } catch (error) {
      next(new HttpError(error, 400));
    }
  }
}

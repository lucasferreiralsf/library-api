import { NextFunction, Request, Response } from "express";
import Book, { IBook } from "./book.schema";
import { HttpError } from "../common/errors";
import userSchema, { IUser } from "../user/user.schema";
import categorySchema from "../category/category.schema";

export class BookController {
  async all(request: Request, response: Response, next: NextFunction) {
    const page = request.query.page || 1;
    const limit = request.query.limit || 10;

    response.json(
      await Book.paginate(
        {},
        {
          page,
          limit,
          populate: [{ path: "categories", select: "title" }, "usersFavorites"]
        }
      )
    );
  }

  async one(
    request: Request & { user: IUser },
    response: Response,
    next: NextFunction
  ) {
    const book = await Book.findOne({ _id: request.params.id })
      .populate("categories", "title")
      .populate("usersFavorites");
    if (book) {
      response.json(book);
    } else {
      next(new HttpError("Not found", 404));
    }
  }

  async create(
    request: Request & { user: IUser },
    response: Response,
    next: NextFunction
  ) {
    try {
      if (
        request.body.categories === null ||
        request.body.categories === undefined
      ) {
        const otherId = await categorySchema.findOne({ title: "Other" }, "_id");
        request.body.categories = [otherId._id.toString()];
      }
      const book = await Book.create(request.body);

      request.body.categories.map(async category => {
        await categorySchema.findOneAndUpdate(
          { _id: category },
          { $push: { books: book._id } }
        );
      });

      if (request.body.usersFavorites.length > 0) {
        request.body.usersFavorites.map(async user => {
          await userSchema.updateOne(
            { _id: user },
            { $push: { favoriteBooks: book._id } }
          );
        });
      }

      response.status(201).json(book);
    } catch (error) {
      next(new HttpError("Not found.", 404));
    }
  }

  async update(
    request: Request & { user: IUser },
    response: Response,
    next: NextFunction
  ) {
    const book = await Book.findOneAndUpdate(
      { _id: request.params.id },
      request.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (request.body.categories.length > 0) {
      request.body.categories.map(async category => {
        await categorySchema.findOneAndUpdate(
          { _id: category },
          { $push: { books: book._id } }
        );
      });
    }

    if (request.body.usersFavorites.length > 0) {
      request.body.usersFavorites.map(async user => {
        await userSchema.updateOne(
          { _id: user },
          { $push: { favoriteBooks: book._id } }
        );
      });
    }
    if (book) {
      response.status(201).json(book);
    } else {
      next(new HttpError("Not found.", 404));
    }
  }

  async delete(
    request: Request & { user: IUser },
    response: Response,
    next: NextFunction
  ) {
    const book = await Book.findOneAndRemove({ _id: request.params.id });
    if (book) {
      response.status(200).json(book);
    } else {
      next(new HttpError("Not found.", 404));
    }
  }
}

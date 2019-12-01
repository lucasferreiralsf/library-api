import { NextFunction, Request, Response } from "express";
import Category, { ICategory } from "./category.schema";
import { HttpError } from "../common/errors";
import { IUser } from "../user/user.schema";
import bookSchema from "../book/book.schema";

export class CategoryController {
  async all(request: Request, response: Response, next: NextFunction) {
    const page = request.query.page || 1;
    const limit = request.query.limit || 10;

    response.json(
      await Category.paginate({}, { page, limit, populate: "books" })
    );
  }

  async one(
    request: Request & { user: IUser },
    response: Response,
    next: NextFunction
  ) {
    const category = await Category.findOne({
      _id: request.params.id
    }).populate("books");
    if (category) {
      response.status(200).json(category);
    } else {
      next(new HttpError("Not found.", 404));
    }
  }

  async create(
    request: Request & { user: IUser },
    response: Response,
    next: NextFunction
  ) {
    try {
      const category = await Category.create(request.body);
      if (request.body.books.length > 0) {
        request.body.books.map(async book => {
          await bookSchema.updateOne(
            { _id: book },
            { $push: { categories: category._id } }
          );
        });
      }
      response.status(201).json(category);
    } catch (error) {
      next(new HttpError("Not found.", 404));
    }
  }

  async update(
    request: Request & { user: IUser },
    response: Response,
    next: NextFunction
  ) {
    const category = await Category.findOneAndUpdate(
      { _id: request.params.id },
      request.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (request.body.books.length > 0) {
      request.body.books.map(async book => {
        await bookSchema.updateOne(
          { _id: book },
          { $push: { categories: category._id } }
        );
      });
    }
    if (category) {
      response.status(200).json(category);
    } else {
      next(new HttpError("Not found.", 404));
    }
  }

  async delete(
    request: Request & { user: IUser },
    response: Response,
    next: NextFunction
  ) {
    const category = await Category.findOneAndRemove({
      _id: request.params.id
    });
    if (category) {
      response.status(200).json(category);
    } else {
      next(new HttpError("Not found.", 404));
    }
  }
}

import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import passport from "passport";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { Routes } from "./routes";
import { errorHandler } from "./common/errors";
import passportStrategy from "./auth/auth.strategy";
import configuration from "./config";

// dotenv.config({path: path.resolve(__dirname)});
async function config() {
  await dotenv.config();
  mongoose
    .connect(configuration.databaseUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    .then(async db => {
      // create express app
      const app = express();

      const next = (req, res, next) => next();

      app.use(
        bodyParser.urlencoded({
          extended: true
        })
      );
      app.use(bodyParser.json());
      passportStrategy(passport);
      app.use(passport.initialize());

      // register express routes from defined application routes
      Routes.forEach(route => {
        (app as any)[route.method](
          route.route,
          route.auth
            ? passport.authenticate("token", { session: false })
            : next,
          route.criteria ? [route.criteria, route.validate] : next,
          (req: Request, res: Response, next: Function) => {
            try {
              const result = new (route.controller as any)()[route.action](
                req,
                res,
                next
              );
              // if (result instanceof Promise) {
              //   result.then(result =>
              //     result !== null && result !== undefined
              //     ? res.send(result)
              //     : undefined
              //     );
              //   } else if (result !== null && result !== undefined) {
              //     res.json(result);
              //   }
            } catch (error) {
              res.status(error.status).json(error.message);
            }
          }
        );
      });

      // setup express app here
      // ...

      // start express server
      app.use(errorHandler);
      app.listen(configuration.port || 3000);

      await db.connection
        .model("Category")
        .updateOne(
          { title: "Other" },
          { title: "Other", description: "Other category." },
          { upsert: true }
        );

      console.log(
        `Library API server has started on http://localhost:${configuration.port || 3000}/`
      );
    })
    .catch(error => console.log(error));
}

config();

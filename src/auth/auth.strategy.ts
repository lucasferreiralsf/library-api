import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../user/user.schema";

export default (passport) => {
  passport.use(
    "token",
    new JwtStrategy(
      {
        secretOrKey: process.env.SECRET_KEY,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
      },
      (payload, cb) => {
        try {
          const user = User.findById(payload.email);
          if (!user) {
            cb(null, false);
          }

          return cb(null, user);
        } catch (error) {
          cb(error, false);
        }
      }
    )
  );
};

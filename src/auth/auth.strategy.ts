import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../user/user.schema";

export default passport => {
  passport.use(
    "token",
    new JwtStrategy(
      {
        secretOrKey: process.env.SECRET_KEY,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        passReqToCallback: true
      },
      async (req, payload, cb) => {
        try {
          const user = await User.findOne({ email: payload.email });
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

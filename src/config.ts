import dotenv from "dotenv";

dotenv.config();

export default {
  secretKey: process.env.SECRET_KEY,
  databaseUrl: process.env.DATABASE_URL,
  port: process.env.PORT
};

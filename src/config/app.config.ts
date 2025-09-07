import { environments } from "eslint-plugin-prettier"
import { parse } from "path";
import { registerAs } from "@nestjs/config";


export default registerAs("appConfig", () => ({
  environment: process.env.NODE_ENV || "production",
  apiVersion: process.env.API_VERSION,
}));

// export const appConfiq = () => ({
//   environment: process.env.NODE_ENV || "production",
// database: {
// * these are not required here anymore since i have moved them to a separate file
// * src/config/database.config.ts


// host: process.env.DATABASE_HOST,
// port: parseInt(process.env.DATABASE_PORT),
// user: (process.env.DATABASE_USER),
// password: (process.env.DATABASE_PASSWORD),
// name: (process.env.DATABASE_NAME),

// synchronize: process.env.DATABASE_SYNC === "true" ? true : false,
// autoLoadEntities: process.env.DATABASE_AUTOLOAD === "true" ? true : false,
//   }
// });
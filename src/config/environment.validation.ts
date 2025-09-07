import * as Joi from 'joi';


// This schema validates the environment variables for the application
// basically it checks if the environment variables are set correctly
// or if they even exist if not then it throws an error
// so that we can fix the issue before running the application

// you can check it by removing one of the environment variables
// and running the application it will throw an error
// this is useful for development and production environments

// it's like telling the specific vairable what it should be

// now this alone is useless we must use it in the ConfigModule
// so we can tell it hey this is the schema for the environment variables
// so it run through the schema (validation) and check if the environment variables are set correctly
export default Joi.object({
  Node_ENV: Joi.string().valid('development', 'production', 'test', 'staging').default('development'),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  PROFILE_API_KEY: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: Joi.string().required(),
  JWT_REFRESH_TOKEN_TTL: Joi.string().required(),
  API_VERSION: Joi.string().default('0.1.0'),
  GCS_PROJECT_ID: Joi.string().required(),
  GCS_BUCKET_NAME: Joi.string().required(),
  GOOGLE_APPLICATION_CREDENTIALS: Joi.string().required(),
  MAIL_HOST: Joi.string().required(),
  SMTP_USERNAME: Joi.string().required(),
  SMTP_PASSWORD: Joi.string().required(),
})
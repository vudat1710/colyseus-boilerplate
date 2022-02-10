import PGPromise from "pg-promise";

require("dotenv").config();
const pgp = PGPromise();

const colyseusConnectionString: string = `postgresql://${process.env.POSTGRES_USERNAME}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}`;
const logConnectionString: string = `postgresql://${process.env.POSTGRES_USERNAME}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_LOG_DATABASE}`;

export const postgresConnection = pgp(colyseusConnectionString);
export const logConnection = pgp(logConnectionString);

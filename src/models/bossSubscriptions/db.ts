import pg from 'pg';
import { configENV } from '../../configENV.js';
configENV();

const pool = new pg.Pool({
  // user: process.env.POSTGRES_USER,
  // host: process.env.POSTGRES_HOST,
  // database: process.env.POSTGRES_DB,
  // password: process.env.POSTGRES_PASSWORD,
  // port: Number(process.env.POSTGRES_PORT),
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'development'
      ? undefined
      : {
          rejectUnauthorized: false,
        },
});

export default pool;

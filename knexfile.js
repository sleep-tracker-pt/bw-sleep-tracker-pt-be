// Update with your config settings.
require("dotenv").config();

module.exports = {
  development: {
    client: "pg",
    connection: process.env.HEROKU_POSTGRESQL_GRAY_URL,
    ssl: true,
    migrations: {
      directory: "./data/migrations/"
    },
    seeds: {
      directory: "./data/seeds/"
    },
    useNullAsDefault: true,
    pool: { min: 2, max: 10 }
  },

  testing: {
    client: "pg",
    connection: process.env.HEROKU_POSTGRESQL_CHARCOAL_URL,
    ssl: true,
    migrations: {
      directory: "./data/migrations/"
    },
    seeds: {
      directory: "./data/seeds/"
    },
    useNullAsDefault: true,
    pool: { min: 2, max: 10 }
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./data/migrations/"
    },
    seeds: {
      directory: "./data/seeds/"
    },
    useNullAsDefault: true
  }
};

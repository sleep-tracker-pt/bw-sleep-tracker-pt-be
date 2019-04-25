// Update with your config settings.

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./data/dev.db"
    },
    migrations: {
      directory: "./data/migrations/"
    },
    seeds: {
      directory: "./data/seeds/"
    },
    useNullAsDefault: true
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "pg",
    connection: {
      database: "d4k99jd8rkd18t",
      user: "ykimldzoyengoq",
      password:
        "3702cb64ba818bc7daafe569eeeec8987d67d2f05c922d4297761019e4f31a25"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "./data/migrations/"
    },
    seeds: {
      directory: "./data/seeds/"
    }
  }
};

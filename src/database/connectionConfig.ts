import path from "path";

const config = {
  client: "sqlite3",

  connection: {
    filename: path.resolve(__dirname, "catnip.sqlite")
  },

  migrations: {
    directory: path.resolve(__dirname, "migrations")
  },

  seeds: {
    directory: path.resolve(__dirname, "seeds")
  },

  useNullAsDefault: true
}

export default config;
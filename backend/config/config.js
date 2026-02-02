require("dotenv").config();

module.exports = {
  development: {
    username: process.env.LOCAL_DB_USER || "iventello_user",
    password: process.env.LOCAL_DB_PASSWORD || "motdepassefort",
    database: process.env.LOCAL_DB_NAME || "iventello_db",
    host: process.env.LOCAL_DB_HOST || "localhost",
    port: process.env.LOCAL_DB_PORT || 5432,
    dialect: "postgres",
    logging: console.log,
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    protocol: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};

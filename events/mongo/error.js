const chalk = require("chalk");

module.exports = {
  name: "error",
  execute(error) {
    console.log(
      chalk.red(`An error occured with the database connection: \n${error}`)
    );
  },
};

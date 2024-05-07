const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const app = require("./app");

// mongodb connection

mongoose.set("strictQuery", false);

mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(process.env.DATABASE_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("conntected to database.......");
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`port is : ${port} bieng used...`);
});

module.exports = app;
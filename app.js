const express = require("express");


const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const userRouter = require("./routes/userRoute");
const parkRouter = require("./routes/parkRoute");
const bookingRouter = require("./routes/bookingRoute");
const billRouter = require("./routes/billRoute");

app.use(express.json({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(cors());
app.options("*", cors());



app.use("/api/users", userRouter);
app.use("/api/parks", parkRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/bills", billRouter);

module.exports = app;
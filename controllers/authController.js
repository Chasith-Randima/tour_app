const User = require("../models/userModel");

const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: process.env.JWT_TOKEN_EXPIRES,
  });
};

const createAndSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.sequre || req.headers["x-forwarded-proto"] === "https",
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    message: "successfull...",
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  if (!user) {
    return res.status(500).json({
        status:"failed",
        message:"there was a error signing up..please try again later"
    })
  }

  createAndSendToken(user, 201, req, res);
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({
        status:"failed",
        message:"there is no user with that email"
    })
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPasswordCheck(password, user.password))) {
    return res.status(401).json({
        status:"failed",
        message:"incorrect email or password"
    })
  }

  createAndSendToken(user, 200, req, res);
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    message: "successfull..",
  });
};

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError(
        "You are not logged in..Please log in to access this route..",
        401
      )
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        "The user belong to this token does no longer exisits...",
        401
      )
    );
  }

  if (currentUser.changedPasswordRecently(decoded.iat)) {
    return next(
      new AppError("Password was recently changed... login again...", 401)
    );
  }

  req.user = currentUser;

  next();
};
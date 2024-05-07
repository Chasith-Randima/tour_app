const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  country:{
    type:String,
  },
  mobileNumber:{
    type:String
  },
  password: {
    type: String,
  },
  passwordConfirm: {
    type: String,
  },
  passwordChangedAt: Date,
  image:{
    type:String
  }
},
{ timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 2000;
  next();
});

userSchema.methods.correctPasswordCheck = async function (
  incomingPassword,
  savedUserPassword
) {
  return await bcrypt.compare(incomingPassword, savedUserPassword);
};

userSchema.methods.changedPasswordRecently = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000.1
    );
    return JWTTimestamp < changedTimeStamp;
  }

};

const User = mongoose.model("User", userSchema);
module.exports = User;
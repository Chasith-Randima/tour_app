const mongoose = require("mongoose");

const parkSchema = new mongoose.Schema({
  parkName: {
    type: String,
    required: [true, "Please enter a name"],
  },
  address: {
    type: String,
    required: [true, "Please enter a address"],
  },
  phone: {
    type: String,
    required: [true, "Please enter a phone number"],
  },
  image:{
    type:String
  },

  // devices: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: "Device",
  //   },
  // ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
},
{ timestamps: true }
);

parkSchema.virtual("bookings", {
  ref: "Bookings",
  foreignField: "park",
  localField: "_id",
});

const Park = mongoose.model("Park", parkSchema);

module.exports = Park;
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    // required: true,
  },
  park: {
    type: mongoose.Schema.ObjectId,
    ref: "Park",
    // required: true,
  },
  date: {
    type: Date,
    // required: true,
  },
  safariOption:{
    type:String
  },
  adults:{
    type:String,
  },
  children:{
    type:String
  },
  noOfDays:{
    type:String
  },
  hotel:{
    type:String
  },
  provider:{
    type:String
  },
  jeep:{
    type:String
  },
  startTime: {
    type: Date,
    // required: true,
  },
  endTime: {
    type: Date,
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
},
{ timestamps: true }
);


// Populate user and park fields every time booking data is queried
bookingSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: '_id name email' // Select multiple fields for user: 'firstName', 'lastName', and 'email'
  }).populate('park');
  next();
});
const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;

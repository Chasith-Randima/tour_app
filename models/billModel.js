const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    // required: true,
  },
  booking: {
    type: mongoose.Schema.ObjectId,
    ref: "Booking",
    // required: true,
  },
  cardHolderName:{
    type:String,
  },
  cardNumber:{
    type:String,
  },
  expiryDate:{
    type:String,
  },
  cvc:{
    type:String,
  },
  amount:{
    type:String
  }
},
{ timestamps: true }
);


// Populate user and park fields every time bill data is queried
billSchema.pre(/^find/, function(next) {
//   this.populate('user').populate('booking');
this.populate({
    path: 'user',
    select: '_id name email' // Select multiple fields for user: 'firstName', 'lastName', and 'email'
  }).populate({
    path: 'booking',
    select: '_id date park' // Select multiple fields for booking: 'bookingName', 'startDate', and 'endDate'
  });
  next();
});
const Bill = mongoose.model("Bill", billSchema);

module.exports = Bill;

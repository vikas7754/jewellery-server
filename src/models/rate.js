const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rateSchema = new Schema(
  {
    product: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      trim: true,
      default: "other",
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Rate = mongoose.model("Rate", rateSchema);
module.exports = Rate;

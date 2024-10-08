const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const updateSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Update = mongoose.model("Update", updateSchema);
module.exports = Update;

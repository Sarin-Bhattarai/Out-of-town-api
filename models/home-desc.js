const mongoose = require("mongoose");

const homeDescSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeDesc", homeDescSchema);

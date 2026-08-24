const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    fileName: {
      type: String,
      required: true
    },

    fileType: {
      type: String,
      required: true
    },

    fileData: {
      type: Buffer,
      required: true
    },

    extractedText: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Resume",
  resumeSchema
);
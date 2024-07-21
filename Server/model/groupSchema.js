const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;

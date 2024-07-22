const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  data: {
    type: Array,
    default: [],
  },
  name: {
    type: String,
    required: true,
  },
  addedOn: {
    type: String,
    required: true,
  },
  updatedOn: {
    type: String,
    required: true,
  },
});

const FolderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  addedOn: {
    type: String,
    required: true,
  },
  updatedOn: {
    type: String,
    required: true,
  },
  files: [FileSchema],
});

const DocsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["file", "folder"],
  },
  file: FileSchema,
  folder: FolderSchema,
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  docs: [DocsSchema],
});

module.exports = mongoose.model("User", UserSchema);

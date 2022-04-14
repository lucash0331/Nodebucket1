/*
Title: item.js
Author: Lucas Hoffman
Date: April 14, 2022
Description: item.js file for nodebucket
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let itemSchema = new Schema({
  taskName: { type: String },
  taskId: { type: String },
  priority: { type: Boolean },
  dueDate: { type: Date },
});

module.exports = itemSchema;

/*
Title: Employee.js
Author: Lucas Hoffman
Date: April 14, 2022
Description: employee.js file for nodebucket
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ItemDocument = require("./item");

let employeeSchema = new Schema(
  {
    empId: { type: String, unique: true, dropDups: true },
    firstName: { type: String },
    lastName: { type: String },
    toDo: [ItemDocument],
    doing: [ItemDocument],
    done: [ItemDocument],
  },
  { collection: "employees" }
);

module.exports = mongoose.model("Employees", employeeSchema);

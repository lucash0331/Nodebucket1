/*
Title: App.js
Author: Lucas Hoffman
Date: April 14, 2022
Description: app.js file for nodebucket  
*/

// Require statements
const express = require("express");
const http = require("http");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const EmployeeAPI = require("./routes/employee-api");

// Using NPM package 'dotenv' to avoid exposing username/password on Github
require("dotenv").config();

// App configurations
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "../dist/nodebucket")));
app.use("/", express.static(path.join(__dirname, "../dist/nodebucket")));

// Variables
const port = process.env.PORT || 3000; // server port

// Mongo database connection string 

const conn = "mongodb+srv://admin:KALImann69%21@buwebdev-cluster-1.m5pn6.mongodb.net/nodebucket?retryWrites=true&w=majority";

// Database connection
mongoose
  .connect(conn, {
    promiseLibrary: require("bluebird"),
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.debug(`Connection to the database instance was successful`);
  })
  .catch((err) => {
    console.log(`MongoDB Error: ${err.message}`);
  });

// API
app.use("/api/employees", EmployeeAPI);

// Create and start server
http.createServer(app).listen(port, function () {
  console.log(`Application started and listening on port: ${port}`);
});

/*
Title: employee-api.js
Author: Lucas Hoffman
Date: April 14, 2022
Description: employee-api page for nodebucket
*/

const express = require("express");
const Employee = require("../models/employee");
const BaseResponse = require("../models/base-response");

const router = express.Router();

let employeeResponse = new BaseResponse();

// Find Employee API
router.get("/:empId", async (req, res) => {
  try {
    Employee.findOne({ empId: req.params.empId }, function (err, employee) {
      if (err) {
        const updateFindError = new BaseResponse("500", `MongoDB Server Error`, err);
        res.status(500).send(updateFindError.toObject());
      } else {
        res.json(employee);
      }
    });
  } catch (e) {
    res.status(500).send({
      message: "Server error: " + e.message,
    });
  }
});

// Find all tasks API
router.get("/:empId/tasks", async (req, res) => {
  try {
    Employee.findOne({ empId: req.params.empId }, "empId todo.taskName done.taskName doing.taskName", function (err, employee) {
      if (err) {
        res.status(500).send({
          message: "Internal server error: " + err.message,
        });
      } else {
        res.json(employee);
      }
    });
  } catch (e) {
    res.status(500).send({
      message: "Internal server error: " + e.message,
    });
  }
});

// Create new task API
router.post("/:empId/tasks", async (req, res) => {
  try {
    Employee.findOne({ empId: req.params.empId }, function (err, employee) {
      if (err) {
        res.status(500).send({
          message: "Internal server error: " + err.message,
        });
      } else {
        const newItem = {
          taskName: req.body.taskName,
          //status: "todo",
        };
        employee.todo.push(newItem);
        employee.save(function (err, updatedEmployee) {
          if (err) {
            res.status(500).send({
              message: "Internal server error: " + err.message,
            });
          } else {
            res.json(updatedEmployee);
          }
        });
      }
    });
  } catch (e) {
    res.status(500).send({
      message: "Internal server error: " + err.message,
    });
  }
});

// Update task API
router.put("/:empId/tasks", async (req, res) => {
  try {
    //probably need an additional parameter (req.params.taskName?)
    Employee.findOne({ empId: req.params.empId }, function (err, employee) {
      if (err) {
        const updateTaskError = new BaseResponse("501", `MongoDB Server Error`, err);
        res.status(501).send(updateTaskError.toObject());
      } else {
        employee.set({
          // status, req.body.task?
          todo: req.body.todo,
          doing: req.body.doing,
          done: req.body.done,
        });
        employee.save(function (err, updatedEmployee) {
          if (err) {
            const updateTaskSaveError = new BaseResponse("500", `MongoDB Server Error`, err);
            res.status(500).send(updateTaskSaveError.toObject());
          } else {
            const updatedTaskOnSuccess = new BaseResponse("200", "Update Successful", updatedEmployee);
            res.json(updatedTaskOnSuccess.toObject());
          }
        });
      }
    });
  } catch (e) {
    const updatedTaskCatchError = new BaseResponse("200", "Update Successful", e);
    res.json(updatedTaskCatchError.toObject());
  }
});

// deleteTask API

router.delete("/:empId/tasks/:taskId", async (req, res) => {
  try {
    Employee.findOne({ empId: req.params.empId }, function (err, employee) {
      if (err) {
        console.log(err);
        const deleteError = new BaseResponse("501", `MongoDB Server Error`, err);
        res.status(501).send(deleteError.toObject());
      } else {
        //console.log(employee.task._id);
        // employee.task.find may not be correct (maybe task.status.find?)
        const todoItem = employee.todo.find((item) => item._id.toString() === req.params.taskId);
        const doingItem = employee.doing.find((item) => item._id.toString() === req.params.taskId);
        const doneItem = employee.done.find((item) => item._id.toString() === req.params.taskId);

        if (todoItem) {
          employee.todo.id(todoItem._id).remove();
          employee.save(function (err, updatedTodoItemEmployee) {
            if (err) {
              console.log(err);
              const deleteTodoError = new BaseResponse("501", `MongoDB Server Error`, err);
              res.status(501).send(deleteTodoError.toObject());
            } else {
              console.log(updatedTodoItemEmployee);
              // add: removed item from (variable) list
              const deleteTodoSuccess = new BaseResponse("200", `Removed Item from list`, updatedTodoItemEmployee);
              res.json(deleteTodoSuccess.toObject());
            }
          });
        } else if (doneItem) {
          employee.done.id(doneItem._id).remove();
          employee.save(function (err, updatedDoneItemEmployee) {
            if (err) {
              const deleteDoneError = new BaseResponse("501", `MongoDB Server Error`, err);
              res.status(501).send(deleteDoneError.toObject());
            } else {
              const deleteDoneSuccess = new BaseResponse("200", "Removed Item from List", updatedDoneItemEmployee);
              res.json(deleteDoneSuccess.toObject());
            }
          });
        } else if (doingItem) {
          employee.doing.id(doingItem._id).remove();
          employee.save(function (err, updatedDoingItemEmployee) {
            if (err) {
              const deleteDoingError = new BaseResponse("501", `MongoDB Server Error`, err);
              res.status(501).send(deleteDoingError.toObject());
            } else {
              const deleteDoingSuccess = new BaseResponse("200", "Removed Item from List", updatedDoingItemEmployee);
              res.json(deleteDoingSuccess.toObject());
            }
          });
        } else {
          console.log("Invalid task id: " + req.params.taskId);
          const deleteFailedNotFound = new BaseResponse("300", "Invalid TaskID", req.params.taskId);
          res.status(300).send(deleteFailedNotFound.toObject());
        }
      }
    });
  } catch (e) {
    console.log(e);
    const deleteFailedError = new BaseResponse("500", "Internal Server Error", e);
    res.status(500).send(deleteFailedError.toObject());
  }
});

module.exports = router;

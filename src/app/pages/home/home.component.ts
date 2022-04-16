/*
Title: Nodebucket
Author: Lucas Hoffman
Date: April 14, 2022
Description: Nodebucket
*/

import { Component, OnInit } from "@angular/core";
import { Employee } from "src/app/shared/models/employee.interface";
import { Item } from "src/app/shared/models/item.interface";
import { TaskService } from "src/app/shared/services/task.service";
import { CookieService } from "ngx-cookie-service";
import { MatDialog } from "@angular/material/dialog";
import { CreateTaskDialogComponent } from "src/app/shared/create-task-dialog/create-task-dialog.component";
import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { ConfirmationService } from "primeng/api";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  employee: Employee;
  task: Item[];
  toDo: Item[];
  doing: Item[];
  done: Item[];
  empId: number;

  constructor(
    private taskService: TaskService,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.empId = parseInt(this.cookieService.get("session_user"), 10);

    this.taskService.findAllTasks(this.empId).subscribe(
      (res) => {
        this.employee = res;
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.toDo = this.employee.toDo;
        this.doing = this.employee.doing;
        this.done = this.employee.done;
      }
    );
  }

  ngOnInit(): void {}

  // Opens dialog to create a new task
  openCreateTaskDialog() {
    const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.taskService.createTask(this.empId, data.text).subscribe(
          (res) => {
            this.employee = res;
          },
          (err) => {
            console.log(err);
          },
          () => {
            this.toDo = this.employee.toDo;
            this.doing = this.employee.doing;
            this.done = this.employee.done;
            // PrimeNG Toast message sender
            this.messageService.add({ severity: "success", summary: "nodebucket", detail: "Task added successfully" });
          }
        );
      }
    });
  }

  // Function called when an item is dragged and dropped
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.updateTaskList(this.empId, this.toDo, this.doing, this.done);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.updateTaskList(this.empId, this.toDo, this.doing, this.done);
    }
  }

  // Update task function
  updateTaskList(empId: number, toDo: Item[], doing: Item[], done: Item[]): void {
    this.taskService.updateTask(empId, toDo, doing, done).subscribe(
      (res) => {
        this.employee = res.data;
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.toDo = this.employee.toDo;
        this.doing = this.employee.doing;
        this.done = this.employee.done;
        // PrimeNG Toast message sender
        this.messageService.add({ severity: "info", summary: "nodebucket", detail: "Task status updated" });
      }
    );
  }

  // Delete task function
  deleteTask(taskId: string) {
    // Rerouted function through PrimeNG ConfirmDialog
    this.confirmationService.confirm({
      message: "Are you sure you want to delete this task?",
      accept: () => {
        if (taskId) {
          this.taskService.deleteTask(this.empId, taskId).subscribe(
            (res) => {
              this.employee = res.data;
            },
            (err) => {
              console.log(err);
            },
            () => {
              this.toDo = this.employee.toDo;
              this.doing = this.employee.doing;
              this.done = this.employee.done;
              // PrimeNG Toast message sender
              this.messageService.add({ severity: "warn", summary: "nodebucket", detail: "Task deleted successfully" });
            }
          );
        }
      },
    });
  }
}

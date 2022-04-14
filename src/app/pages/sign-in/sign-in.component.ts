/*
Title: Nodebucket
Author: Lucas Hoffman
Date: April 14, 2022
Description: Nodebucket
*/

import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.css"],
})
export class SignInComponent implements OnInit {
  form: FormGroup;
  error: string;

  constructor(private router: Router, private cookieService: CookieService, private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      empId: [null, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
    });
  }
  login() {
    const empId = this.form.controls["empId"].value;

    this.http.get("/api/employees/" + empId).subscribe((res) => {
      if (res) {
        this.cookieService.set("session_user", empId, 1);
        sessionStorage.setItem("name", `${res["firstName"]} ${res["lastName"]}`);
        this.router.navigate(["/"]);
      } else {
        this.error = "You entered an invalid employee ID";
      }
    });
  }
}

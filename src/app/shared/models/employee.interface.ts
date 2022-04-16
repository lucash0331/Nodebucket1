/*
Title: Nodebucket
Author: Lucas Hoffman
Date: April 14, 2022
Description: Nodebucket
*/

import { Item } from "./item.interface";

export interface Employee {
  empId: string;
  toDo: Item[];
  doing: Item[];
  done: Item[];
  task: Item[];
}

import { Injectable } from "@angular/core";
import { EmployeeJson } from "../models/employee.model";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  public employeeJsonList$: BehaviorSubject<EmployeeJson[]> =
    new BehaviorSubject<EmployeeJson[]>(this.getLocalEmployeeList());

  constructor() {}

  private getLocalEmployeeList(): EmployeeJson[] {
    const employeeJsonString = localStorage.getItem("employeeList") ?? "";
    if (employeeJsonString.length > 0) {
      const employeeJsonList = JSON.parse(employeeJsonString) as EmployeeJson[];
      employeeJsonList.sort(
        (a, b) => a["workScheduleSort"] - b["workScheduleSort"]
      ); // 按排班顺序（工作）升序排序
      return employeeJsonList;
    } else {
      return [];
    }
  }

  public addEmployeeJson(employeeJson: EmployeeJson): boolean {
    const employeeJsonList = this.employeeJsonList$.getValue();
    const newEmployeeJsonList = [...employeeJsonList, employeeJson];
    this.updateEmployeeJsonList(newEmployeeJsonList);
    return true;
  }

  public updateEmployeeJson(employeeJson: EmployeeJson): boolean {
    const { id } = employeeJson;
    if (id) {
      const employeeJsonList = this.employeeJsonList$.getValue();
      const newEmployeeJsonList = employeeJsonList.map((e) =>
        e.id === id ? employeeJson : e
      );
      this.updateEmployeeJsonList(newEmployeeJsonList);
      return true;
    }
    return false;
  }

  public deleteEmployeeById(id: string): boolean {
    const employeeJsonList = this.employeeJsonList$.getValue();
    const newEmployeeJsonList = employeeJsonList.filter((e) => e.id !== id);
    console.log(
      "%c Line:50 🥓 newEmployeeJsonList",
      "color:#42b983",
      newEmployeeJsonList
    );
    this.updateEmployeeJsonList(newEmployeeJsonList);
    return true;
  }

  public updateEmployeeJsonList(employeeJsonList: EmployeeJson[]): void {
    if (employeeJsonList.length > 1) {
      this.sortEmployees(employeeJsonList); // 按排班顺序（工作）升序排序
    }
    this.employeeJsonList$.next(employeeJsonList);
    localStorage.setItem(
      "employeeList",
      JSON.stringify(this.employeeJsonList$.getValue())
    );
  }

  private sortEmployees(
    employeeJsonList: EmployeeJson[],
    key: keyof EmployeeJson = "workScheduleSort"
  ) {
    employeeJsonList.sort((a, b) => +a[key] - +b[key]); // 按排班顺序（工作）升序排序
  }
}

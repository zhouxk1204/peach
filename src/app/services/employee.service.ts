import { BehaviorSubject } from "rxjs";
import { EmployeeJson } from "../models/employee.model";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  public employeeJsonList$: BehaviorSubject<EmployeeJson[]> =
    new BehaviorSubject<EmployeeJson[]>(this.getLocalEmployeeList());

  get employeeJsonList(): EmployeeJson[] {
    return this.employeeJsonList$.getValue();
  }

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
    const newEmployeeJsonList = [...this.employeeJsonList, employeeJson];
    this.updateEmployeeJsonList(newEmployeeJsonList);
    return true;
  }

  public updateEmployeeJson(employeeJson: EmployeeJson): boolean {
    const { id } = employeeJson;
    if (id) {
      const newEmployeeJsonList = this.employeeJsonList.map((e) =>
        e.id === id ? employeeJson : e
      );
      this.updateEmployeeJsonList(newEmployeeJsonList);
      return true;
    }
    return false;
  }

  public deleteEmployeeById(id: string): boolean {
    const newEmployeeJsonList = this.employeeJsonList.filter(
      (e) => e.id !== id
    );
    this.updateEmployeeJsonList(newEmployeeJsonList);
    return true;
  }

  public updateEmployeeJsonList(employeeJsonList: EmployeeJson[]): void {
    if (employeeJsonList.length > 1) {
      this.sortEmployees(employeeJsonList); // 按排班顺序（工作）升序排序
    }
    this.employeeJsonList$.next(employeeJsonList);
    localStorage.setItem("employeeList", JSON.stringify(this.employeeJsonList));
  }

  private sortEmployees(
    employeeJsonList: EmployeeJson[],
    key: keyof EmployeeJson = "workScheduleSort"
  ) {
    employeeJsonList.sort((a, b) => +a[key] - +b[key]); // 按排班顺序（工作）升序排序
  }

  public getEmployeeIdByName(name: string): string {
    return this.employeeJsonList.find((e) => e.name === name)?.id ?? "";
  }
}

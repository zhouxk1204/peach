import { Injectable } from '@angular/core';
import { Employee, EmployeeJson } from '../models/employee.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employeeJsonList$: BehaviorSubject<EmployeeJson[]> =
    new BehaviorSubject<EmployeeJson[]>(this.getLocalEmployeeList());

  constructor() {}

  private getLocalEmployeeList(): EmployeeJson[] {
    const employeeJsonString = localStorage.getItem('employeeList') ?? '';
    if (employeeJsonString.length > 0) {
      const employeeJsonList = JSON.parse(employeeJsonString) as EmployeeJson[];
      employeeJsonList.sort(
        (a, b) => a['workScheduleSort'] - b['workScheduleSort']
      ); // 按排班顺序（工作）升序排序
      return employeeJsonList;
    } else {
      return [];
    }
  }

  public addEmployeeJson(employeeJson: EmployeeJson): boolean {
    const employeeJsonList = this.employeeJsonList$.getValue();
    const newEmployeeJsonList = [...employeeJsonList, employeeJson];
    newEmployeeJsonList.sort(
      (a, b) => a['workScheduleSort'] - b['workScheduleSort']
    ); // 按排班顺序（工作）升序排序
    this.updateEmployeeJsonList(newEmployeeJsonList);
    return true;
  }

  private updateEmployeeJsonList(employeeJsonList: EmployeeJson[]): void {
    this.employeeJsonList$.next(employeeJsonList);
    localStorage.setItem(
      'employeeList',
      JSON.stringify(this.employeeJsonList$.getValue())
    );
  }
}

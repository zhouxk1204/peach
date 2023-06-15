import { Injectable } from "@angular/core";
import { EmployeeReportJson } from "../types/index.type";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  private reportJsonList$: BehaviorSubject<EmployeeReportJson[]> =
    new BehaviorSubject<EmployeeReportJson[]>(this.getLocalReportJsonList());

  constructor() {}

  getReportJsonList(): BehaviorSubject<EmployeeReportJson[]> {
    return this.reportJsonList$;
  }

  private getLocalReportJsonList(): EmployeeReportJson[] {
    const reportJsonString = localStorage.getItem("reportJsonList") ?? "";
    if (reportJsonString.length > 0) {
      return JSON.parse(reportJsonString) as EmployeeReportJson[];
    } else {
      return [];
    }
  }

  public saveReportJsonList(reportJsonList: EmployeeReportJson[]): boolean {
    this.reportJsonList$.next(reportJsonList);
    localStorage.setItem("reportJsonList", JSON.stringify(reportJsonList));
    return true;
  }
}

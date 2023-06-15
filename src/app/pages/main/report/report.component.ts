import { Component, OnInit } from "@angular/core";
import { reportTableHeaders } from "./data";
import { Worksheet } from "exceljs";
import { EmployeeService } from "src/app/services/employee.service";
import { EmployeeReportJson } from "src/app/types/index.type";
import { ReportService } from "src/app/services/report.service";
import { EmployeeReport } from "src/app/models/report.model";
import Decimal from "decimal.js";

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss"],
})
export class ReportComponent implements OnInit {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly reportService: ReportService
  ) {
    this.reportService.getReportJsonList().subscribe((reportJsonList) => {
      const employeeReportList = reportJsonList.map(
        (e) => new EmployeeReport(e)
      );
      employeeReportList.sort(
        (a, b) => a.workScheduleSort - b.workScheduleSort
      );

      const total = employeeReportList.reduce(
        (a, b) => a.plus(b.total),
        new Decimal(0)
      );

      const days = employeeReportList.reduce(
        (a, b) => a.plus(b.attendances),
        new Decimal(0)
      );

      employeeReportList.forEach((e) =>
        e.setServe(+total.div(days).toFixed(2))
      );

      this.data = employeeReportList;
    });
  }

  headers = reportTableHeaders;
  data: EmployeeReport[] = [];
  ngOnInit(): void {}

  import(worksheet: Worksheet): void {
    const reportJsonMap: Map<string, EmployeeReportJson> = new Map();
    const rowsData: any[][] = (worksheet.getRows(1, worksheet.rowCount) || [])
      .map((e) => e.values)
      .map((e) => (e as any[]).slice(1));

    let dateList: Date[] = [];

    rowsData.forEach((row) => {
      let employeeId = "";
      row.forEach((cell, col) => {
        if (!cell) {
          return;
        }

        if (cell instanceof Date) {
          if (col === 1) {
            dateList = [cell];
          } else {
            dateList.push(cell);
          }
        } else if (col === 0) {
          employeeId = this.employeeService.getEmpolyeeIdByName(cell);
        } else {
          if (employeeId.length > 0) {
            const reportJson: EmployeeReportJson = reportJsonMap.get(
              employeeId
            ) ?? {
              employeeId,
              dayReportJsonList: [],
            };

            const date = dateList[col - 1];
            reportJson.dayReportJsonList.push({
              date,
              label: cell.toString(),
            });
            reportJsonMap.set(employeeId, reportJson);
          }
        }
      });
    });
    this.reportService.saveReportJsonList(Array.from(reportJsonMap.values()));
  }

  export(): void {}
}

import { Component, OnInit } from "@angular/core";
import { EXPORT_HEADERS, reportTableHeaders } from "./data";
import { Workbook, Worksheet } from "exceljs";
import { EmployeeService } from "src/app/services/employee.service";
import {
  EmployeeReportJson,
  ExportExcelOption,
} from "src/app/types/index.type";
import { ReportService } from "src/app/services/report.service";
import {
  EmployeeReport,
  EmployeeReportSummary,
} from "src/app/models/report.model";
import { generateExcelColumnRange } from "src/app/utils/common";
import { ExcelService } from "src/app/services/excel.service";
import { saveAs } from "file-saver";
import { ROLE } from "src/app/constants/commom.constant";
import Decimal from "decimal.js";

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss"],
})
export class ReportComponent implements OnInit {
  headers = reportTableHeaders;
  data: EmployeeReport[] = [];
  employeeReportSummary!: EmployeeReportSummary;
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly reportService: ReportService,
    private readonly excelService: ExcelService
  ) {
    this.reportService
      .getReportJsonList()
      .subscribe((employeeReportJsonList) => {
        const employeeReportSummary = new EmployeeReportSummary();
        employeeReportSummary.addEmployeeReportList(employeeReportJsonList);
        this.employeeReportSummary = employeeReportSummary;
      });
  }

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

  export(): void {
    const { employeeReportList } = this.employeeReportSummary;

    const date = employeeReportList[0].dailyReportList[0].date;
    const fileName = `${date.getFullYear()}年${
      date.getMonth() + 1
    }月上班（加班）工分汇算`;

    const startOffset = 2; // 起始偏移量，用于计算合并行的范围

    const data = [
      this.getExportData(employeeReportList),
      this.getDisplayExportData(employeeReportList),
    ];
    let start = 0;
    const exportExcelOptions: ExportExcelOption[] = EXPORT_HEADERS.map(
      (header, index) => {
        if (index > 0) {
          start += data[index - 1].length;
          start += startOffset;
        }
        return {
          headers: header,
          titleMergeRowRange: generateExcelColumnRange(start, header.length, 1),
          title: fileName,
          data: data[index],
        };
      }
    );
    // 创建 Workbook 和 Worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(fileName);

    this.excelService.createWorksheet(exportExcelOptions, worksheet);

    // 将 Workbook 写入缓冲区，并保存为 Excel 文件
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `${fileName}.xlsx`);
    });
  }

  getExportData(employeeReportList: EmployeeReport[]): any[][] {
    const { other, special, total, workdays, serve } =
      this.employeeReportSummary;
    const data = employeeReportList.map((e) => {
      return [
        e.name,
        e.factor,
        e.other,
        e.special,
        e.total,
        e.workdays,
        e.annual,
        e.role === ROLE[1].id ? new Decimal(e.serve).times(2).toNumber() : "",
        e.score,
      ];
    });
    data.push(["合计", "", other, special, total, workdays, "", serve, ""]);
    return data;
  }

  getDisplayExportData(employeeReportList: EmployeeReport[]): any[][] {
    return employeeReportList.map((e) => {
      return [e.name, e.factor, e.score, e.attendances];
    });
  }
}

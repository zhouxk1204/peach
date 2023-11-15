import { Component, OnInit } from "@angular/core";
import { EXPORT_HEADERS, reportTableHeaders } from "./data";
import {
  EmployeeReport,
  EmployeeReportSummary,
} from "src/app/models/report.model";
import {
  EmployeeReportJson,
  ExportExcelOption,
} from "src/app/types/index.type";
import { Workbook, Worksheet } from "exceljs";
import {
  generateExcelColumnRange,
  getSettingByKey,
} from "src/app/utils/common";

import Decimal from "decimal.js";
import { EmployeeService } from "src/app/services/employee.service";
import { ExcelService } from "src/app/services/excel.service";
import { ReportService } from "src/app/services/report.service";
import { saveAs } from "file-saver";

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
        if (employeeReportJsonList.length === 0) return;
        const employeeReportSummary = new EmployeeReportSummary();
        employeeReportSummary.addEmployeeReportList(employeeReportJsonList);
        this.data = employeeReportSummary.employeeReportList;
        console.log("%c Line:41 🍏 this.data", "color:#ed9ec7", this.data);
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
          employeeId = this.employeeService.getEmployeeIdByName(cell);
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
      // this.getDisplayExportData(employeeReportList),
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
    // [
    // "姓名",
    // "系数",
    // "其他岗位工分",
    // "胃2岗位工分",
    // "时间总工分",
    // "时间总工分系数分",
    // "本月出勤天数",
    // "本月年假天数",
    // "科务天数",
    // ],
    const data = employeeReportList.map((e) => {
      return [
        e.name,
        e.factor,
        e.other,
        new Decimal(e.special).times(1.2).toNumber(),
        e.score,
        +new Decimal(e.score)
          .times(e.factor)
          .toNumber()
          .toFixed(getSettingByKey("decimalPlaces")),
        e.attendances,
        e.annual,
        e.serveDay,
      ];
    });
    return data;
  }
}

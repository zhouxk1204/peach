import * as ExcelJS from "exceljs";
import * as fs from "file-saver";

import { GENDER, ROLE, STATUS } from "../constants/commom.constant";

import { EmployeeJson } from "../models/employee.model";
import { EmployeeService } from "./employee.service";
import { ExportExcelOption } from "../types/index.type";
import { Injectable } from "@angular/core";
import { Worksheet } from "exceljs";

@Injectable({
  providedIn: "root",
})
export class ExcelService {
  constructor(private readonly employeeService: EmployeeService) {}

  readExcelFile(file: File): Promise<ExcelJS.Worksheet> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const data = new Uint8Array(reader.result as ArrayBuffer);
        const workbook = new ExcelJS.Workbook();

        workbook.xlsx
          .load(data)
          .then(() => {
            resolve(workbook.worksheets[0]);
          })
          .catch((error) => {
            reject(error);
          });
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  }

  exportUserExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    const employeeJsonList = this.employeeService.employeeJsonList$.getValue();

    const header = Object.keys(employeeJsonList[0]).filter((e) => e !== "id");

    header.forEach((value, colIndex) => {
      const cell = worksheet.getCell(1, colIndex + 1);
      cell.value = value;
      this.setCellBorder(cell);
      this.setCellAlignment(cell);
    });

    employeeJsonList
      .map((employeeJson) => {
        const res: any[] = [];
        header.forEach((key) => {
          const value = employeeJson[key as keyof EmployeeJson];
          if (key === "gender") {
            res.push(GENDER.find((e) => e.id === value)?.label ?? "error");
          } else if (key === "role") {
            res.push(ROLE.find((e) => e.id === value)?.label ?? "error");
          } else if (key === "status") {
            res.push(STATUS.find((e) => e.id === value)?.label ?? "error");
          } else {
            res.push(value);
          }
        });
        return res;
      })
      .forEach((row, rowIndex) => {
        row.forEach((cellValue, colIndex) => {
          const cell = worksheet.getCell(rowIndex + 2, colIndex + 1);
          cell.value = cellValue;
          this.setCellBorder(cell);
          this.setCellAlignment(cell);
        });
      });

    // 将 Workbook 写入缓冲区，并保存为 Excel 文件
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      fs.saveAs(blob, "user.xlsx");
    });
  }

  /**
   * 设置单元格边框
   * @param cell 单元格对象
   * @returns 无返回值，修改传入的cell对象的border属性
   */
  private setCellBorder(cell: ExcelJS.Cell) {
    // 将传入的cell对象的边框属性分别设置为细线样式
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  }

  /**
   * 设置单元格对齐方式
   * @param cell 单元格对象
   * @param vertical 垂直对齐方式，可选值为"top"（顶部对齐）、"middle"（居中对齐，默认值）或"bottom"（底部对齐）
   * @param horizontal 水平对齐方式，可选值为"left"（左对齐）、"center"（居中对齐，默认值）或"right"（右对齐）
   * @returns 无返回值，修改传入的cell对象的alignment属性
   */
  private setCellAlignment(
    cell: ExcelJS.Cell,
    vertical: "top" | "middle" | "bottom" = "middle",
    horizontal: "left" | "center" | "right" = "center"
  ): void {
    // 将传入的垂直和水平对齐方式赋值给cell对象的alignment属性
    cell.alignment = { vertical, horizontal };
  }

  /**
   * 生成 Excel 文件
   * @param exportExcelOption
   */
  createWorksheet(
    exportExcelOptions: ExportExcelOption[],
    worksheet: Worksheet
  ) {
    for (let exportExcelOption of exportExcelOptions) {
      const {
        title = "",
        titleMergeRowRange = "",
        headers,
        data,
      } = exportExcelOption;

      const tStart = titleMergeRowRange.split(":")[0];
      const tStartRow = tStart.replace(/\d+/g, "");
      // title cell
      const titleCell = worksheet.getCell(tStart);
      titleCell.value = title;
      this.setCellBorder(titleCell);
      this.setCellAlignment(titleCell);
      // 合并单元格
      worksheet.mergeCells(titleMergeRowRange);

      // header Row
      const headerStartCell = worksheet.getCell(`${tStartRow}2`);
      for (let i = 0; i < headers.length; i++) {
        const cell = worksheet.getCell(
          headerStartCell.row,
          headerStartCell.col + i
        );
        cell.value = headers[i];
        this.setCellBorder(cell);
        this.setCellAlignment(cell);
      }

      // data Row
      const dataStartCell = worksheet.getCell(`${tStartRow}3`);
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        for (let j = 0; j < row.length; j++) {
          const cell = worksheet.getCell(
            dataStartCell.row + i,
            dataStartCell.col + j
          );
          cell.value = row[j];
          this.setCellBorder(cell);
          this.setCellAlignment(cell);
        }
      }

      // remark Row
      const remarkCell = worksheet.getCell(`${tStartRow}${4 + data.length}`);
      remarkCell.value = "时间总工分=其他岗位工分+（胃2岗位工分*1.2）";
    }
    return worksheet;
  }
}

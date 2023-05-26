import { Injectable } from "@angular/core";
import * as ExcelJS from "exceljs";
import { EmployeeService } from "./employee.service";
import { GENDER, ROLE } from "../constants/commom.constant";
import { EmployeeJson } from "../models/employee.model";
import * as fs from "file-saver";

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
}

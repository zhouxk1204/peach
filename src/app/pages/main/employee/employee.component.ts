import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { GENDER, ROLE, STATUS } from "src/app/constants/commom.constant";
import { Employee } from "src/app/models/employee.model";
import { EmployeeService } from "src/app/services/employee.service";
import { ExcelService } from "src/app/services/excel.service";
import { v4 as uuidv4 } from "uuid";
import { employTableHeaders } from "./data";
import { TableHeader } from "src/app/types/index.type";
import { Worksheet } from "exceljs";
import { AddComponent } from "src/app/component/dialog/add/add.component";
import { DeleteComponent } from "src/app/component/dialog/delete/delete.component";

@Component({
  selector: "app-employee",
  templateUrl: "./employee.component.html",
  styleUrls: ["./employee.component.scss"],
})
export class EmployeeComponent implements OnInit {
  headers: TableHeader[] = [];
  data: Employee[] = [];

  constructor(
    private readonly employeeService: EmployeeService,
    private matDialog: MatDialog,
    private excelService: ExcelService
  ) {
    this.headers = employTableHeaders;
    this.employeeService.employeeJsonList$.subscribe((res) => {
      this.data = res.length > 0 ? res.map((e) => new Employee(e)) : [];
    });
  }

  ngOnInit(): void {}

  add() {
    this.matDialog.open(AddComponent, {
      data: null,
    });
  }

  edit(id: string) {
    const employee = this.data.find((e) => e.id === id);
    if (employee) {
      this.matDialog.open(AddComponent, {
        data: employee,
      });
    }
  }

  deleteItem(id: string) {
    const employee = this.data.find((e) => e.id === id);
    if (employee) {
      this.matDialog.open(DeleteComponent, {
        data: employee,
      });
    }
  }

  import(worksheet: Worksheet) {
    const rowsData: any[][] =
      worksheet
        .getRows(1, worksheet.rowCount)
        ?.map((e) => e.values)
        .map((e) => (e as any[]).slice(1)) || [];
    const header = rowsData[0];
    const employeeJsonList = rowsData.slice(1).map((row) => {
      const employeeJson: any = {};
      employeeJson.id = uuidv4();
      row.forEach((e, i) => {
        if (header[i] === "gender") {
          e = GENDER.find((gender) => gender.label === e)?.id ?? -1;
        } else if (header[i] === "role") {
          e = ROLE.find((role) => role.label === e)?.id ?? -1;
        } else if (header[i] === "status") {
          e = STATUS.find((status) => status.label === e)?.id ?? -1;
        }
        employeeJson[header[i]] = e;
      });
      return employeeJson;
    });
    this.employeeService.updateEmployeeJsonList(employeeJsonList);
  }

  export() {
    this.excelService.exportUserExcel();
  }
}

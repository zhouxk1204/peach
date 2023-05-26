import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { GENDER, ROLE } from "src/app/constants/commom.constant";
import { AddComponent } from "src/app/dialog/add/add.component";
import { DeleteComponent } from "src/app/dialog/delete/delete.component";
import { Employee, EmployeeJson } from "src/app/models/employee.model";
import { EmployeeService } from "src/app/services/employee.service";
import { ExcelService } from "src/app/services/excel.service";
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-employee",
  templateUrl: "./employee.component.html",
  styleUrls: ["./employee.component.scss"],
})
export class EmployeeComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    "workScheduleSort",
    "name",
    "factor",
    "gender",
    "role",
    "actions",
  ];
  dataSource!: MatTableDataSource<Employee>;
  loading: boolean = false;
  constructor(
    private readonly matSnackBar: MatSnackBar,
    private readonly employeeService: EmployeeService,
    private readonly excelService: ExcelService,
    private readonly matDialog: MatDialog
  ) {
    this.employeeService.employeeJsonList$.subscribe(
      (employeeJsonList: EmployeeJson[]) => {
        if (employeeJsonList.length > 0) {
          this.dataSource = new MatTableDataSource(
            employeeJsonList.map((employeeJson) => new Employee(employeeJson))
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource = new MatTableDataSource<Employee>([]);
        }
      }
    );
  }

  ngAfterViewInit() {
    if (this.dataSource.data.length > 0) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    if (this.dataSource.data.length > 0) return;

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {}

  addNew() {
    const dialogRef = this.matDialog.open(AddComponent, {
      data: null,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  startEdit(employee: Employee) {
    const dialogRef = this.matDialog.open(AddComponent, {
      data: employee,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  private refreshTable() {
    if (this.dataSource.data.length > 0) {
      this.paginator._changePageSize(this.paginator.pageSize);
    }
  }

  deleteItem(employee: Employee) {
    const dialogRef = this.matDialog.open(DeleteComponent, {
      data: employee,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  handleImport(event: any) {
    this.loading = true;
    const file: File = event.target.files[0]; // 获取上传的文件
    this.excelService.readExcelFile(file).then((worksheet) => {
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
          }
          employeeJson[header[i]] = e;
        });
        return employeeJson;
      });
      this.employeeService.updateEmployeeJsonList(employeeJsonList);
      this.loading = false;
      this.matSnackBar.open(`一键导入成功！🎉🎉`, "关闭", {
        duration: 2 * 1000,
      });
    });
  }

  download() {
    this.excelService.exportUserExcel();
  }
}

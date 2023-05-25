import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { AddComponent } from "src/app/dialog/add/add.component";
import { DeleteComponent } from "src/app/dialog/delete/delete.component";
import { Employee, EmployeeJson } from "src/app/models/employee.model";
import { EmployeeService } from "src/app/services/employee.service";

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

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly matDialog: MatDialog
  ) {
    this.employeeService.employeeJsonList$.subscribe(
      (employeeJsonList: EmployeeJson[]) => {
        if (employeeJsonList.length > 0) {
          this.dataSource = new MatTableDataSource(
            employeeJsonList.map((employeeJson) => new Employee(employeeJson))
          );
        }
      }
    );
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
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
    this.paginator._changePageSize(this.paginator.pageSize);
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
}

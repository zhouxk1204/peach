import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Employee } from "src/app/models/employee.model";
import { EmployeeService } from "src/app/services/employee.service";

@Component({
  selector: "app-delete",
  templateUrl: "./delete.component.html",
  styleUrls: ["./delete.component.scss"],
})
export class DeleteComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Employee,
    private employeeService: EmployeeService,
    private readonly matSnackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  confirmDelete(): void {
    const result = this.employeeService.deleteEmployeeById(this.data.id);
    if (result) {
      this.matSnackBar.open(`员工信息删除成功！🎉🎉`, "关闭", {
        duration: 3 * 1000,
      });
    }
  }
}

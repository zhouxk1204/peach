import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Employee, EmployeeJson } from "src/app/models/employee.model";
import { EmployeeService } from "src/app/services/employee.service";
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"],
})
export class AddComponent implements OnInit {
  nameControl: FormControl = new FormControl("", [Validators.required]);
  factorControl: FormControl = new FormControl("", [Validators.required]);
  sortControl: FormControl = new FormControl("", [Validators.required]);
  genderControl: FormControl = new FormControl(2);
  roleControl: FormControl = new FormControl(0);

  constructor(
    private readonly matSnackBar: MatSnackBar,
    private employeeService: EmployeeService,
    public dialogRef: MatDialogRef<AddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Employee | null
  ) {}

  ngOnInit(): void {
    if (this.data) {
      const { name, factor, workScheduleSort, gender, role } = this.data;
      this.nameControl.setValue(name);
      this.factorControl.setValue(factor);
      this.sortControl.setValue(workScheduleSort);
      this.genderControl.setValue(gender);
      this.roleControl.setValue(role);
    }
  }

  getFactorErrorMessage() {
    if (this.factorControl.hasError("required")) {
      return "请输入员工系数";
    }

    if (this.factorControl.invalid) {
      return "请输入正确的员工系数";
    }

    return "";
  }

  getSortErrorMessage() {
    if (this.factorControl.hasError("required")) {
      return "请输入员工排班顺序";
    }

    if (this.factorControl.invalid) {
      return "请输入正确的员工排班顺序";
    }

    return "";
  }

  get isFormInvalid() {
    return [this.nameControl, this.factorControl, this.sortControl]
      .map((e) => e.valid)
      .some((e) => !e);
  }

  validateForm(): void {
    const isInvalid = [this.nameControl, this.factorControl, this.sortControl]
      .map((e) => {
        e.markAsTouched();
        return e.valid;
      })
      .some((e) => !e);

    if (!isInvalid) {
      const employeeJson: EmployeeJson = {
        id: this.data ? this.data.id : uuidv4(),
        name: this.nameControl.value.trim().toString(),
        factor: this.factorControl.value,
        workScheduleSort: this.sortControl.value,
        gender: this.genderControl.value,
        role: this.roleControl.value,
      };

      const result = this.data
        ? this.employeeService.updateEmployeeJson(employeeJson)
        : this.employeeService.addEmployeeJson(employeeJson);

      if (result) {
        const message = this.data ? "信息更新" : "信息添加";
        this.resetForm();
        this.matSnackBar.open(`员工${message}成功！🎉🎉`, "关闭", {
          duration: 3 * 1000,
        });
      }
    }
  }

  resetForm() {
    [this.nameControl, this.factorControl, this.sortControl].forEach((e) => {
      e.reset();
    });
  }
}

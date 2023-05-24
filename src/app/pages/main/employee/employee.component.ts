import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeJson } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit {
  nameControl: FormControl = new FormControl('', [Validators.required]);
  factorControl: FormControl = new FormControl('', [Validators.required]);
  sortControl: FormControl = new FormControl('', [Validators.required]);
  genderControl: FormControl = new FormControl('2');
  roleControl: FormControl = new FormControl('0');

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly matSnackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  getFactorErrorMessage() {
    if (this.factorControl.hasError('required')) {
      return '请输入员工系数';
    }

    if (this.factorControl.invalid) {
      return '请输入正确的员工系数';
    }

    return '';
  }

  getSortErrorMessage() {
    if (this.factorControl.hasError('required')) {
      return '请输入员工排班顺序';
    }

    if (this.factorControl.invalid) {
      return '请输入正确的员工排班顺序';
    }

    return '';
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
        id: uuidv4(),
        name: this.nameControl.value.trim().toString(),
        factor: +this.factorControl.value,
        workScheduleSort: +this.sortControl.value,
        gender: +this.genderControl.value,
        role: +this.roleControl.value,
      };
      if (this.employeeService.addEmployeeJson(employeeJson)) {
        [this.nameControl, this.factorControl, this.sortControl].forEach(
          (e) => {
            e.reset();
          }
        );

        this.matSnackBar.open('员工添加成功！🎉🎉', '关闭', {
          duration: 3 * 1000,
        });
      }
    }
  }
}

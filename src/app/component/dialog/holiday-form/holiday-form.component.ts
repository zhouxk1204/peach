import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { HOLIDAY, HOLIDAY_TYPE } from "src/app/constants/commom.constant";
import { Holiday, HolidayJson } from "src/app/models/holiday.model";
import { HolidayService } from "src/app/services/holiday.service";
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-holiday-form",
  templateUrl: "./holiday-form.component.html",
  styleUrls: ["./holiday-form.component.scss"],
})
export class HolidayFormComponent implements OnInit {
  holidays = HOLIDAY;
  types = HOLIDAY_TYPE;

  formGroup = new FormGroup({
    holiday: new FormControl(0, [Validators.required]),
    type: new FormControl(0, [Validators.required]),
    date: new FormControl(new Date(), [Validators.required]),
    workWeight: new FormControl(1, [Validators.required]),
    extraWeight: new FormControl(1.5, [Validators.required]),
  });

  constructor(
    public readonly dialogRef: MatDialogRef<HolidayFormComponent>,
    private readonly holidayService: HolidayService,
    @Inject(MAT_DIALOG_DATA) public data: Holiday | null
  ) {}

  ngOnInit(): void {
    if (this.data) {
      const { holiday, type, date, workWeight, extraWeight } = this.data;
      this.formGroup.get("holiday")?.setValue(holiday);
      this.formGroup.get("type")?.setValue(type);
      this.formGroup.get("date")?.setValue(date);
      this.formGroup.get("workWeight")?.setValue(workWeight);
      this.formGroup.get("extraWeight")?.setValue(extraWeight);
    }
  }

  onSubmit() {
    // 校验所有字段
    if (this.formGroup.valid) {
      const holidayJson = Object.assign(this.formGroup.value, {
        id: this.data ? this.data.id : uuidv4(),
      }) as unknown as HolidayJson;
      if (this.data) {
        this.holidayService.updateHolidayJson(holidayJson);
      } else {
        this.holidayService.addHolidayJson(holidayJson);
      }
      this.dialogRef.close();
    }
  }
}

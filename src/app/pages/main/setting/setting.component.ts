import { Component, OnInit } from "@angular/core";
import { Holiday } from "src/app/models/holiday.model";
import { TableHeader } from "src/app/types/index.type";
import { holidayTableHeaders } from "./data";
import { MatDialog } from "@angular/material/dialog";
import { HolidayFormComponent } from "src/app/component/dialog/holiday-form/holiday-form.component";
import { HolidayService } from "src/app/services/holiday.service";
import { DeleteHolidayComponent } from "src/app/component/dialog/delete-holiday/delete-holiday.component";

@Component({
  selector: "app-setting",
  templateUrl: "./setting.component.html",
  styleUrls: ["./setting.component.scss"],
})
export class SettingComponent implements OnInit {
  headers: TableHeader[] = [];
  data: Holiday[] = [];

  constructor(
    private matDialog: MatDialog,
    private readonly holidayService: HolidayService
  ) {
    this.headers = holidayTableHeaders;
    this.holidayService.holidayJsonList$.subscribe((res) => {
      this.data = res.length > 0 ? res.map((e) => new Holiday(e)) : [];
    });
  }

  ngOnInit(): void {}

  add() {
    this.matDialog.open(HolidayFormComponent, {
      data: null,
    });
  }

  edit(id: string): void {
    const data = this.data.find((d) => d.id === id);
    if (data) {
      this.matDialog.open(HolidayFormComponent, {
        data,
      });
    }
  }

  deleteItem(id: string) {
    const data = this.data.find((d) => d.id === id);
    if (data) {
      this.matDialog.open(DeleteHolidayComponent, {
        data,
      });
    }
  }
}

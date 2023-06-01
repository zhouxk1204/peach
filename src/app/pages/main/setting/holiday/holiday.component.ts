import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Holiday } from "src/app/models/holiday.model";
import { HolidayService } from "src/app/services/holiday.service";
import { TableHeader } from "src/app/types/index.type";
import { holidayTableHeaders } from "../data";
import { DeleteHolidayComponent } from "src/app/component/dialog/delete-holiday/delete-holiday.component";
import { HolidayFormComponent } from "src/app/component/dialog/holiday-form/holiday-form.component";

@Component({
  selector: "app-holiday",
  templateUrl: "./holiday.component.html",
  styleUrls: ["./holiday.component.scss"],
})
export class HolidayComponent implements OnInit {
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

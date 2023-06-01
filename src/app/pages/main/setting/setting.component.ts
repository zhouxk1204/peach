import { Component, OnInit } from "@angular/core";
import { Holiday } from "src/app/models/holiday.model";
import { DayType, TableHeader } from "src/app/types/index.type";
import { holidayTableHeaders } from "./data";
import { MatDialog } from "@angular/material/dialog";
import { HolidayFormComponent } from "src/app/component/dialog/holiday-form/holiday-form.component";
import { HolidayService } from "src/app/services/holiday.service";
import { DeleteHolidayComponent } from "src/app/component/dialog/delete-holiday/delete-holiday.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { v4 } from "uuid";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { routes } from "../main-routing.module";
import { ActivatedRoute, Router } from "@angular/router";

export interface Fruit {
  name: string;
}

@Component({
  selector: "app-setting",
  templateUrl: "./setting.component.html",
  styleUrls: ["./setting.component.scss"],
})
export class SettingComponent implements OnInit {
  tabs: any[] = [];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.tabs =
      routes
        .find((e) => e.path === "")
        ?.children?.find((e) => e.path === "setting")
        ?.children?.filter((e) => e.path!.length > 0) ?? [];
  }

  onTabChanged(event: MatTabChangeEvent) {
    const path = this.tabs[event.index].path;
    this.router.navigate([path], { relativeTo: this.route });
  }
}

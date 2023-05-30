import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HolidayJson } from "../models/holiday.model";

@Injectable({
  providedIn: "root",
})
export class HolidayService {
  public holidayJsonList$: BehaviorSubject<HolidayJson[]> = new BehaviorSubject<
    HolidayJson[]
  >(this.getLocalHolidayJsonList());

  constructor() {}

  private getLocalHolidayJsonList(): HolidayJson[] {
    const holidayJsonString = localStorage.getItem("holidayList") ?? "";
    if (holidayJsonString.length > 0) {
      const holidayJsonList = JSON.parse(holidayJsonString) as HolidayJson[];
      return holidayJsonList;
    } else {
      return [];
    }
  }

  public addHolidayJson(holidayJson: HolidayJson): boolean {
    const holidayJsonList = this.holidayJsonList$.getValue();
    const newHolidayJsonList = [...holidayJsonList, holidayJson];
    this.updateHolidayJsonList(newHolidayJsonList);
    return true;
  }

  private updateHolidayJsonList(holidayJsonList: HolidayJson[]): void {
    this.holidayJsonList$.next(holidayJsonList);
    localStorage.setItem(
      "holidayList",
      JSON.stringify(this.holidayJsonList$.getValue())
    );
  }

  public deleteHolidayById(id: string) {
    const holidayJsonList = this.holidayJsonList$.getValue();
    const newHolidayJsonList = holidayJsonList.filter((e) => e.id !== id);
    this.updateHolidayJsonList(newHolidayJsonList);
    return true;
  }

  public updateHolidayJson(holidayJson: HolidayJson): boolean {
    const { id } = holidayJson;
    if (id) {
      const holidayJsonList = this.holidayJsonList$.getValue();
      const newHolidayJsonList = holidayJsonList.map((e) =>
        e.id === id ? holidayJson : e
      );
      this.updateHolidayJsonList(newHolidayJsonList);
      return true;
    }
    return false;
  }
}

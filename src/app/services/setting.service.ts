import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HolidayJson } from "../models/holiday.model";
import { SettingJson } from "../types/index.type";

@Injectable({
  providedIn: "root",
})
export class SettingService {
  public settingJson$: BehaviorSubject<SettingJson> =
    new BehaviorSubject<SettingJson>(this.getLocalSettingJson());
  constructor() {}

  private getLocalSettingJson(): SettingJson {
    const settingJsonString = localStorage.getItem("setting") ?? "";
    if (settingJsonString.length > 0) {
      const employeeJsonList = JSON.parse(settingJsonString) as SettingJson;
      return employeeJsonList;
    } else {
      return {
        workMultiplier: 1,
        extraMultiplier: 1.5,
        specialWeight: 0.1,
        decimalPlaces: 2,
      };
    }
  }

  updateSetting(settingJson: SettingJson) {
    this.settingJson$.next(settingJson);
    localStorage.setItem("setting", JSON.stringify(settingJson));
  }
}

import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { SettingService } from "src/app/services/setting.service";
import { SettingJson } from "src/app/types/index.type";

@Component({
  selector: "app-other",
  templateUrl: "./other.component.html",
  styleUrls: ["./other.component.scss"],
})
export class OtherComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  formGroup = new FormGroup({
    workMultiplier: new FormControl(0, [Validators.required]),
    extraMultiplier: new FormControl(0, [Validators.required]),
    specialWeight: new FormControl(0, [Validators.required]),
    decimalPlaces: new FormControl(0, [Validators.required]),
  });

  constructor(private readonly settingService: SettingService) {
    const data = this.settingService.settingJson$.getValue();
    Object.keys(data).forEach((key: unknown) => {
      const k = key as keyof SettingJson;
      this.formGroup.get(k)?.setValue(data[k]);
    });

    this.formGroup.valueChanges.subscribe((value) => {
      const data = value as SettingJson;
      this.settingService.updateSetting(data);
    });
  }

  ngOnInit(): void {}
}

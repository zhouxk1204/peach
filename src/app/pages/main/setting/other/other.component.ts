import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DayType } from "src/app/types/index.type";

@Component({
  selector: "app-other",
  templateUrl: "./other.component.html",
  styleUrls: ["./other.component.scss"],
})
export class OtherComponent implements OnInit {
  dayTypeList: DayType[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  dayTypeCtrl = new FormControl();

  formGroup = new FormGroup({
    workWeight: new FormControl(1, [Validators.required]),
    extraWeight: new FormControl(1.5, [Validators.required]),
    weighted: new FormControl(0.1, [Validators.required]),
    accuracy: new FormControl(2, [Validators.required]),
  });

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {}

  gridColumns(): number {
    if (this.breakpointObserver.isMatched(Breakpoints.XSmall)) {
      return 1; // 在小尺寸下显示 1 列
    }
    if (this.breakpointObserver.isMatched(Breakpoints.Small)) {
      return 2; // 在中尺寸下显示 2 列
    }
    return 4; // 在其他尺寸下显示 4 列
  }
}

import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DeleteComponent } from "../delete/delete.component";
import { Holiday } from "src/app/models/holiday.model";
import { HolidayService } from "src/app/services/holiday.service";

@Component({
  selector: "app-delete-holiday",
  templateUrl: "./delete-holiday.component.html",
  styleUrls: ["./delete-holiday.component.scss"],
})
export class DeleteHolidayComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteHolidayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Holiday,
    private holidayService: HolidayService,
    private readonly matSnackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  confirmDelete() {
    const result = this.holidayService.deleteHolidayById(this.data.id);
    if (result) {
      this.matSnackBar.open(`节假日删除成功！🎉🎉`, "关闭", {
        duration: 3 * 1000,
      });
    }
  }
}

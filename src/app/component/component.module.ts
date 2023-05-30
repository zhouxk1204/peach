import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableComponent } from "./table/table.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../material.module";
import { MainRoutingModule } from "../pages/main/main-routing.module";
import { PipesModule } from "../pipes/pipes.module";
import { AddComponent } from "./dialog/add/add.component";
import { DeleteComponent } from "./dialog/delete/delete.component";
import { HolidayFormComponent } from './dialog/holiday-form/holiday-form.component';
import { DeleteHolidayComponent } from './dialog/delete-holiday/delete-holiday.component';

@NgModule({
  declarations: [TableComponent, DeleteComponent, AddComponent, HolidayFormComponent, DeleteHolidayComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
  ],
  exports: [TableComponent],
})
export class ComponentModule {}

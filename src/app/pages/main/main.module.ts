import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainRoutingModule } from "./main-routing.module";
import { MainComponent } from "./main.component";
import { MaterialModule } from "src/app/material.module";
import { EmployeeComponent } from "./employee/employee.component";
import { HomeComponent } from "./home/home.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PipesModule } from "src/app/pipes/pipes.module";
import { SettingComponent } from "./setting/setting.component";
import { ComponentModule } from "src/app/component/component.module";
import { ReportComponent } from './report/report.component';

@NgModule({
  declarations: [
    MainComponent,
    EmployeeComponent,
    HomeComponent,
    SettingComponent,
    ReportComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    ComponentModule,
  ],
})
export class MainModule {}

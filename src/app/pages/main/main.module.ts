import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainRoutingModule } from "./main-routing.module";
import { MainComponent } from "./main.component";
import { MaterialModule } from "src/app/material.module";
import { EmployeeComponent } from "./employee/employee.component";
import { HomeComponent } from "./home/home.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PipesModule } from "src/app/pipes/pipes.module";

@NgModule({
  declarations: [MainComponent, EmployeeComponent, HomeComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
  ],
})
export class MainModule {}

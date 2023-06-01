import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./main.component";
import { EmployeeComponent } from "./employee/employee.component";
import { HomeComponent } from "./home/home.component";
import { SettingComponent } from "./setting/setting.component";
import { ReportComponent } from "./report/report.component";
import { HolidayComponent } from "./setting/holiday/holiday.component";
import { OtherComponent } from "./setting/other/other.component";

export const routes: Routes = [
  {
    path: "",
    component: MainComponent,
    children: [
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full",
      },
      {
        path: "home",
        component: HomeComponent,
        data: {
          title: "首页",
          icon: "home",
        },
      },
      {
        path: "report",
        component: ReportComponent,
        data: {
          title: "月度工分汇算",
          icon: "paid",
        },
      },
      {
        path: "employee",
        component: EmployeeComponent,
        data: {
          title: "员工管理",
          icon: "account_circle",
        },
      },
      {
        path: "setting",
        component: SettingComponent,
        data: {
          title: "设置",
          icon: "settings",
        },
        children: [
          {
            path: "",
            redirectTo: "holiday",
            pathMatch: "full",
          },
          {
            path: "holiday",
            component: HolidayComponent,
            data: {
              title: "节假日设置",
              icon: "",
            },
          },
          {
            path: "other",
            component: OtherComponent,
            data: {
              title: "其他设置",
              icon: "",
            },
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}

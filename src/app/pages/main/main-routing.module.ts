import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./main.component";
import { EmployeeComponent } from "./employee/employee.component";
import { HomeComponent } from "./home/home.component";
import { SettingComponent } from "./setting/setting.component";
import { ReportComponent } from "./report/report.component";

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
          title: "通用设置",
          icon: "settings",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}

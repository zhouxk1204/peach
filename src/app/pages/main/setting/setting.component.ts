import { Component, OnInit } from "@angular/core";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { routes } from "../main-routing.module";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";

export interface Fruit {
  name: string;
}

@Component({
  selector: "app-setting",
  templateUrl: "./setting.component.html",
  styleUrls: ["./setting.component.scss"],
})
export class SettingComponent implements OnInit {
  tabs: any[] = [];
  selectedIndex: number = 0;
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.tabs =
      routes
        .find((e) => e.path === "")
        ?.children?.find((e) => e.path === "setting")
        ?.children?.filter((e) => e.path!.length > 0) ?? [];
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const selectedIndex = this.tabs.findIndex(
          (e) => event.url.indexOf(e.path) > -1
        );
        this.selectedIndex = selectedIndex > -1 ? selectedIndex : 0;
      }
    });
  }

  ngOnInit(): void {}

  onTabChanged(event: MatTabChangeEvent) {
    const path = this.tabs[event.index].path;
    this.router.navigate([path], { relativeTo: this.route });
  }
}

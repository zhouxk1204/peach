import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Route, Router } from '@angular/router';
import { routes } from './main-routing.module';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  menuList: Route[] = routes
    .map((e) => e.children!.filter((e2) => e2.path!.length > 0))
    .flat();
  selectedMenu: string = '';
  activePageTitle: string = '';
  private navigationSubscription: Subscription;
  constructor(router: Router) {
    this.navigationSubscription = router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // 获取当前选中项的路由链接
        this.activePageTitle =
          this.menuList.find((e) => e.path === event.url.slice(1))?.data![
            'title'
          ] ?? this.menuList[0].data!['title'];
      });
  }

  ngOnInit(): void {
    if (this.menuList.length > 0) {
      this.selectedMenu = this.menuList[0].path ?? '';
    }
  }

  ngOnDestroy(): void {
    // 取消订阅以避免内存泄漏
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}

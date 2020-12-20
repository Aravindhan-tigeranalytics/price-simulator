import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'price-simulator';
  profit_pool = false;
  hide = false;
  route;
  sidebars = [
    '/pricepool/yc',
    '/pricepool',
    '/pricepool/yearly-trends',
    '/pricepool/summ',
  ];
  home = ['/', '/home'];

  constructor(private router: Router) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        // console.log(val, 'VAL OF ROUTER ');
        // console.log(val.url, 'VAL OF ROUTER ');
        if (this.sidebars.includes(val.url)) {
          // this.hideNav()
          this.profit_pool = true;
        } else {
          this.profit_pool = false;
        }
        if (this.home.includes(val.url)) {
          // this.hideNav()
          this.hide = true;
        } else {
          this.hide = false;
        }
      }
    });
  }
}

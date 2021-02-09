import { Component,ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {SpinnerService} from "./shared/services/spinner.service"
import {
 delay
} from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  showSpinner: boolean;
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

  constructor(private spinnerService: SpinnerService,private router: Router,private cd: ChangeDetectorRef) {
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

    this.spinnerService.getSpin().pipe(delay(0)).subscribe(data=>{
      this.showSpinner = data
    })
  }

  ngAfterViewInit() {
    // this.cd.detectChanges();
}
 
}

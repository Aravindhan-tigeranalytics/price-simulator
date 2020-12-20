import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../shared/services/auth.services';

@Component({
  selector: 'app-profit-pool-header',
  templateUrl: './profit-pool-header.component.html',
  styleUrls: ['./profit-pool-header.component.scss'],
})
export class ProfitPoolHeaderComponent implements OnInit {
  hide = true;
  isLoggedIn = false;

  constructor(private router: Router, private authService: AuthService) {}
  hideNav() {
    this.hide = true;
  }
  logout() {
    this.authService.logout();
  }
  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((data) => {
      this.isLoggedIn = data;
    });
    // this.router.events.subscribe((val) => {
    //   if (val instanceof NavigationEnd) {
    //     console.log(val, 'VAL OF ROUTER ');
    //     console.log(val.url, 'VAL OF ROUTER ');
    //     if (val.url == '/pricepool') {
    //       // this.hideNav()
    //       this.hide = false;
    //     } else {
    //       this.hide = true;
    //     }
    //   }
    // });
  }
}

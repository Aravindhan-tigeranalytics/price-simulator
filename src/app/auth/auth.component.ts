import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/services/auth.services';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  invalidLogin = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}
  signIn(creds) {
    this.authService.login(creds).subscribe(
      (data) => {
        this.invalidLogin = false;
        localStorage.setItem('token', data['token']);
        this.authService.isLoggedInObservable.next(true);
        // let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl')
        this.router.navigate(['home']);

        // console.log(data, "LOGIN DATA")
      },
      (error) => {
        this.invalidLogin = true;
        localStorage.removeItem('token')
        // localStorage.setItem('token','5e822efb0672751ca20584be198ca93420198678');
        // this.authService.isLoggedInObservable.next(true);
        // let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl')
        // this.router.navigate(['home']);
        // this.invalidLogin = true;
        // console.log(error,"ERROR")
      }
    );
  }
}

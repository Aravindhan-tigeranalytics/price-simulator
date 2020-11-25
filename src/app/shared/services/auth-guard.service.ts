import { Injectable } from '@angular/core';
import {CanActivate,Router} from "@angular/router"
// import {RouterStateSnapshot} from "@angular/router"
import {AuthService} from "./auth.services"

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService : AuthService, private router : Router) { }
  canActivate(){
    if(this.authService.isLogged()) return true
    this.router.navigate(['/'])
    return false
  }
}

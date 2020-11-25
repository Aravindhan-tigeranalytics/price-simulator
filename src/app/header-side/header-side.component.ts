import { Component, OnInit } from '@angular/core';
import { Router,NavigationEnd } from '@angular/router';
import {AuthService} from "../shared/services/auth.services"

@Component({
  selector: 'app-header-side',
  templateUrl: './header-side.component.html',
  styleUrls: ['./header-side.component.scss']
})
export class HeaderSideComponent implements OnInit {
  hide = false
  isLoggedIn = false;

  constructor(private router: Router,private authService : AuthService) { }

  hideNav(){
    this.hide = true

  }
  logout(){
    this.authService.logout()
  }
  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(data=>{
      this.isLoggedIn = data

    })
    this.router.events.subscribe((val) => {
      if(val instanceof NavigationEnd){
        console.log(val , "VAL OF ROUTER ")
        console.log(val.url , "VAL OF ROUTER ")
        if(val.url == "/"){
          // this.hideNav()
this.hide = true
        }
        else{
          this.hide = false
        }

      }
      
    })
  }

}

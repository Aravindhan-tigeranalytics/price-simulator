import { Component, OnInit } from '@angular/core';
import {AuthService} from "../shared/services/auth.services"

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  constructor(private authService : AuthService) { }

  logout(){
    this.authService.logout()
  }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(data=>{
      this.isLoggedIn = data

    })
  }



}

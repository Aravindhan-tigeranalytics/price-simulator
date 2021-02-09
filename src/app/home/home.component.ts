import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {User} from "../shared/models/user.model"
import {AuthService} from "../shared/services/auth.services"

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user : string

  constructor(private auth : AuthService) { }

  ngOnInit(): void {
this.auth.getUser().subscribe((data:User)=>{
  this.user = data.name || data.email
})


  }
  logout(){
    this.auth.logout()
  }

}

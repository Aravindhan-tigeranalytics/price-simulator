import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  HttpClient,
  HttpResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import {User} from "../models/user.model"
// import {} from "@angular/htt"
import {environment} from '../../../environments/environment'
@Injectable()
export class AuthService {
  isLoggedInObservable = new BehaviorSubject<boolean>(false);
  userObservable = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router) {
    let token = localStorage.getItem('token');
    let user  = localStorage.getItem('user')
    if (token) {
      this.isLoggedInObservable.next(true);
      this.userObservable.next(JSON.parse(user) as User)
    }
  }
  getUser():Observable<User>{

    return this.userObservable.asObservable()
  }
  setUser(user:User){
    this.userObservable.next(user)
  }
  login(credentials) {
    console.log(credentials, 'CREDENTIALS');
    let formData: FormData = new FormData();
    formData.append('email', credentials.email);
    formData.append('password', credentials.password);
    return this.http.post( environment.baseUrl+ '/api/user/token/', formData, {
      headers: { skip: 'true' },
    });
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user')
    this.isLoggedInObservable.next(false);
    this.router.navigate(['/']);
  }
  isLogged(): boolean {
    return this.isLoggedInObservable.getValue();
  }
  isLoggedIn(): Observable<boolean> {
    // let token = localStorage.getItem('token')
    return this.isLoggedInObservable.asObservable();
  }
}

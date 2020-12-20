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
// import {} from "@angular/htt"

@Injectable()
export class AuthService {
  isLoggedInObservable = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient, private router: Router) {
    let token = localStorage.getItem('token');
    if (token) {
      this.isLoggedInObservable.next(true);
    }
  }
  login(credentials) {
    console.log(credentials, 'CREDENTIALS');
    let formData: FormData = new FormData();
    formData.append('email', credentials.email);
    formData.append('password', credentials.password);
    return this.http.post('http://localhost:8000/api/user/token/', formData, {
      headers: { skip: 'true' },
    });
  }
  logout() {
    localStorage.removeItem('token');
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

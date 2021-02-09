// import { Observable } from 'rxjs/Observable';

import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { HttpInterceptor,HttpResponse } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
  import { tap } from 'rxjs/operators';
// import { MsalService } from '../services/msal.service';
import { HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import {SpinnerService} from './spinner.service'
// import 'rxjs/add/observable/fromPromise';
// import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  constructor(private spinnerService : SpinnerService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    
    this.spinnerService.show();
    const skipIntercept = request.headers.has('skip');
    // console.log(skipIntercept, 'SKIP INTERCEPT');

    if (skipIntercept) {
      request = request.clone({
        headers: request.headers.delete('skip'),
      });
      // console.log(request.headers, 'REQUEST HEAADERS');
      return next.handle(request).pipe(
        tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                this.spinnerService.hide();
            }
        }, (error) => {
            this.spinnerService.hide();
        })
    );
    } else {
      // setTimeout(()=>{
        return this.handleAccess(request, next);

      // },5000) 
    }
  }

  private handleAccess(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // console.log('comming inside handle access');
    const token = localStorage.getItem('token');
    let changedRequest = request;
    // HttpHeader object immutable - copy values
    const headerSettings: { [name: string]: string | string[] } = {};

    for (const key of request.headers.keys()) {
      headerSettings[key] = request.headers.getAll(key);
    }
    if (token) {
      headerSettings['Authorization'] = 'Token ' + token;
    }
    // headerSettings['Content-Type'] = 'application/json';
    const newHeader = new HttpHeaders(headerSettings);

    changedRequest = request.clone({
      headers: newHeader,
    });
    return next.handle(changedRequest).pipe(
      tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
              this.spinnerService.hide();
          }
      }, (error) => {
          this.spinnerService.hide();
      })
  );
  }
 
}

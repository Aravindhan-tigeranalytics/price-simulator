// import { Observable } from 'rxjs/Observable';

import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
// import { MsalService } from '../services/msal.service';
import { HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
// import 'rxjs/add/observable/fromPromise';
// import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // if (request.headers.get('skip')) {
    //   return next.handle(request);
    // }

    const skipIntercept = request.headers.has('skip');
    console.log(skipIntercept, 'SKIP INTERCEPT');

    if (skipIntercept) {
      request = request.clone({
        headers: request.headers.delete('skip'),
      });
      console.log(request.headers, 'REQUEST HEAADERS');
      return next.handle(request);
    } else {
      return this.handleAccess(request, next);
    }
  }

  private handleAccess(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('comming inside handle access');
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
    return next.handle(changedRequest);
  }
}

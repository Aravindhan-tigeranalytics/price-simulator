import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
// import {RouterStateSnapshot} from "@angular/router"
import { Observable, BehaviorSubject, Subject, throwError } from 'rxjs';
import { map, tap, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { AuthService } from './auth.services';
import { ApiService } from './api.service';
import { ProfitPool } from '../models/profit-pool.model';

@Injectable()
export class ProfitPoolService {
  private profitPoolObservable = new BehaviorSubject<ProfitPool[]>([]);
  constructor(private apiService: ApiService, private router: Router) {
    let data = this.apiService.getPricePool();
    console.log(data, 'PROFIT POOL DATA');
    this.profitPoolObservable.next(data);
  }

  public getProfitPool(): Observable<ProfitPool[]> {
    return this.profitPoolObservable.asObservable();
  }
}

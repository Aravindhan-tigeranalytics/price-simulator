import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  Observable,
  of,
  from,
  BehaviorSubject,
  combineLatest,
  pipe,
} from 'rxjs';
import {
  distinct,
  distinctUntilChanged,
  map,
  reduce,
  filter,
  tap,
} from 'rxjs/operators';
import { ApiService } from '../shared/services/api.service';
import { NewUnit } from '../shared/models/unit';
@Component({
  selector: 'app-scenario-builder',
  templateUrl: './scenario-builder.component.html',
  styleUrls: ['./scenario-builder.component.scss'],
})
export class ScenarioBuilderComponent implements OnInit {
  active = 1;
  arr = [1, 2, 3, 4, 5];
  categories_filter = [];
  retailer_filter = [];
  product_filter = [];
  tableData$: Observable<NewUnit[]>;
  retailers = new FormControl();
  categories = new FormControl();
  products = new FormControl();
  simulateFlag$ = new BehaviorSubject<boolean>(false);
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.tableData$ = this.api.getUnits();
    this.tableData$.subscribe((data: NewUnit[]) => {
      this.populateFilter(data);
    });
  }

  populateFilter(datas) {
    of(...datas)
      .pipe(distinct((unit: NewUnit) => unit.category))
      .subscribe((data) => {
        this.categories_filter.push(data.category);
      });
    of(...datas)
      .pipe(distinct((unit: NewUnit) => unit.retailer))
      .subscribe((data) => {
        this.retailer_filter.push(data.retailer);
      });
    of(...datas)
      .pipe(distinct((unit: NewUnit) => unit.product_group))
      .subscribe((data) => {
        this.product_filter.push(data.product_group);
      });
  }
  ResetSummary() {
    this.simulateFlag$.next(false);
  }
  SimulateSummary() {
    this.simulateFlag$.next(true);
    console.log('CLICKED');
  }

  applyFilter() {}
  resetFilter() {}
}

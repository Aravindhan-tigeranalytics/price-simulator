import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitSummaryTableComponent } from './profit-summary-table.component';

describe('ProfitSummaryTableComponent', () => {
  let component: ProfitSummaryTableComponent;
  let fixture: ComponentFixture<ProfitSummaryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfitSummaryTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitSummaryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

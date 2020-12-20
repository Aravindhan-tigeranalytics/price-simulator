import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyComparisonComponent } from './yearly-comparison.component';

describe('YearlyComparisonComponent', () => {
  let component: YearlyComparisonComponent;
  let fixture: ComponentFixture<YearlyComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearlyComparisonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YearlyComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

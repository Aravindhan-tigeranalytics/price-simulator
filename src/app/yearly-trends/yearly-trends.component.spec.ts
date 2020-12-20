import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyTrendsComponent } from './yearly-trends.component';

describe('YearlyTrendsComponent', () => {
  let component: YearlyTrendsComponent;
  let fixture: ComponentFixture<YearlyTrendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearlyTrendsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YearlyTrendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearPlanComponent } from './year-plan.component';

describe('YearPlanComponent', () => {
  let component: YearPlanComponent;
  let fixture: ComponentFixture<YearPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YearPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

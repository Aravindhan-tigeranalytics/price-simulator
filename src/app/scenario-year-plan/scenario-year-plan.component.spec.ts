import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioYearPlanComponent } from './scenario-year-plan.component';

describe('ScenarioYearPlanComponent', () => {
  let component: ScenarioYearPlanComponent;
  let fixture: ComponentFixture<ScenarioYearPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScenarioYearPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioYearPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

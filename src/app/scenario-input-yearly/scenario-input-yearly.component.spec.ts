import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioInputYearlyComponent } from './scenario-input-yearly.component';

describe('ScenarioInputYearlyComponent', () => {
  let component: ScenarioInputYearlyComponent;
  let fixture: ComponentFixture<ScenarioInputYearlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScenarioInputYearlyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioInputYearlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

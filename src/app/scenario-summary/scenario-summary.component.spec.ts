import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioSummaryComponent } from './scenario-summary.component';

describe('ScenarioSummaryComponent', () => {
  let component: ScenarioSummaryComponent;
  let fixture: ComponentFixture<ScenarioSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScenarioSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

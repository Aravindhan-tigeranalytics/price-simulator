import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioComparisonTableComponent } from './scenario-comparison-table.component';

describe('ScenarioComparisonTableComponent', () => {
  let component: ScenarioComparisonTableComponent;
  let fixture: ComponentFixture<ScenarioComparisonTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScenarioComparisonTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioComparisonTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulateScenarioModalComponent } from './simulate-scenario-modal.component';

describe('SimulateScenarioModalComponent', () => {
  let component: SimulateScenarioModalComponent;
  let fixture: ComponentFixture<SimulateScenarioModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulateScenarioModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulateScenarioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulateSummaryRowComponent } from './simulate-summary-row.component';

describe('SimulateSummaryRowComponent', () => {
  let component: SimulateSummaryRowComponent;
  let fixture: ComponentFixture<SimulateSummaryRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulateSummaryRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulateSummaryRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

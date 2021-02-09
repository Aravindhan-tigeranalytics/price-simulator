import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScIpSimulatedTdComponent } from './sc-ip-simulated-td.component';

describe('ScIpSimulatedTdComponent', () => {
  let component: ScIpSimulatedTdComponent;
  let fixture: ComponentFixture<ScIpSimulatedTdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScIpSimulatedTdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScIpSimulatedTdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

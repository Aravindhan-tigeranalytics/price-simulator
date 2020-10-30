import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashInputComponent } from './dash-input.component';

describe('DashInputComponent', () => {
  let component: DashInputComponent;
  let fixture: ComponentFixture<DashInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

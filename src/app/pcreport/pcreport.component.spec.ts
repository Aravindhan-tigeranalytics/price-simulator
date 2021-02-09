import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcreportComponent } from './pcreport.component';

describe('PcreportComponent', () => {
  let component: PcreportComponent;
  let fixture: ComponentFixture<PcreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PcreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PcreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

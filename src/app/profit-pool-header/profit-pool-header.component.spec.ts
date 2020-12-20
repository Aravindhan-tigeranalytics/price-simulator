import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitPoolHeaderComponent } from './profit-pool-header.component';

describe('ProfitPoolHeaderComponent', () => {
  let component: ProfitPoolHeaderComponent;
  let fixture: ComponentFixture<ProfitPoolHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfitPoolHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitPoolHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

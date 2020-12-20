import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricePoolComponent } from './price-pool.component';

describe('PricePoolComponent', () => {
  let component: PricePoolComponent;
  let fixture: ComponentFixture<PricePoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricePoolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricePoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

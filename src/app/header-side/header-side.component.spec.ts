import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSideComponent } from './header-side.component';

describe('HeaderSideComponent', () => {
  let component: HeaderSideComponent;
  let fixture: ComponentFixture<HeaderSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderSideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

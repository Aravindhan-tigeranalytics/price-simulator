import { TestBed } from '@angular/core/testing';

import { PriceScenarioService } from './price-scenario.service';

describe('PriceScenarioService', () => {
  let service: PriceScenarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PriceScenarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

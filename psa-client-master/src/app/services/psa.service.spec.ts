import { TestBed } from '@angular/core/testing';

import { PsaService } from './psa.service';

describe('PsaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PsaService = TestBed.get(PsaService);
    expect(service).toBeTruthy();
  });
});

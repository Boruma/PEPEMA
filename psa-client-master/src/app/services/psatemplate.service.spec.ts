import { TestBed } from '@angular/core/testing';

import { PsatemplateService } from './psatemplate.service';

describe('PsatemplateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PsatemplateService = TestBed.get(PsatemplateService);
    expect(service).toBeTruthy();
  });
});

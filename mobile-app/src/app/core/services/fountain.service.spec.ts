import { TestBed } from '@angular/core/testing';

import { FountainService } from './fountain.service';

describe('FountainService', () => {
  let service: FountainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FountainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { DataservicService } from './dataservic.service';

describe('DataservicService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataservicService = TestBed.get(DataservicService);
    expect(service).toBeTruthy();
  });
});

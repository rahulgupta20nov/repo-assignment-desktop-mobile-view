import { TestBed } from '@angular/core/testing';

import { SalesLogsService } from './sales-logs.service';

describe('SalesLogsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesLogsService = TestBed.get(SalesLogsService);
    expect(service).toBeTruthy();
  });
});

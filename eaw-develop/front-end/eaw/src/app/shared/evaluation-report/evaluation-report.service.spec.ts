import { TestBed } from '@angular/core/testing';

import { EvaluationReportService } from './evaluation-report.service';

describe('EvaluationReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EvaluationReportService = TestBed.get(EvaluationReportService);
    expect(service).toBeTruthy();
  });
});

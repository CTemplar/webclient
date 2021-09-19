import { TestBed } from '@angular/core/testing';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  beforeEach(() => TestBed.configureTestingModule({    
    providers: [LoggerService]
  }));

  it('should be created', () => {
    const service: LoggerService = TestBed.get(LoggerService);
    expect(service).toBeTruthy();
  });
});

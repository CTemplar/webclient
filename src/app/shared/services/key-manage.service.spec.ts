import { TestBed } from '@angular/core/testing';

import { KeyManageService } from './key-manage.service';

describe('KeyManageService', () => {
  let service: KeyManageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyManageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

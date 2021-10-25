import { TestBed } from '@angular/core/testing';

import { UserSelectManageService } from './user-select-manage.service';

describe('UserSelectManageService', () => {
  let service: UserSelectManageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSelectManageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

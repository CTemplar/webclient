import { TestBed, async, inject } from '@angular/core/testing';

import { LoadGuard } from './load.guard';

describe('LoadGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadGuard]
    });
  });

  it('should ...', inject([LoadGuard], (guard: LoadGuard) => {
    expect(guard).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { LoaderGuard } from './loader.guard';

describe('LoaderGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoaderGuard]
    });
  });

  it('should ...', inject([LoaderGuard], (guard: LoaderGuard) => {
    expect(guard).toBeTruthy();
  }));
});

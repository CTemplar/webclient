import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UseCacheDialogComponent } from './use-cache-dialog.component';

describe('UseCacheDialogComponent', () => {
  let component: UseCacheDialogComponent;
  let fixture: ComponentFixture<UseCacheDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UseCacheDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseCacheDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

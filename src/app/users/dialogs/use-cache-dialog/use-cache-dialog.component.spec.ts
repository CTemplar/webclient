import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UseCacheDialogComponent } from './use-cache-dialog.component';

describe('UseCacheDialogComponent', () => {
  let component: UseCacheDialogComponent;
  let fixture: ComponentFixture<UseCacheDialogComponent>;

  beforeEach(async(() => {
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

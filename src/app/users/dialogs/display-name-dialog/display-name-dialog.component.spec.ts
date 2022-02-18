import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DisplayNameDialogComponent } from './display-name-dialog.component';

describe('DisplayNameDialogComponent', () => {
  let component: DisplayNameDialogComponent;
  let fixture: ComponentFixture<DisplayNameDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayNameDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

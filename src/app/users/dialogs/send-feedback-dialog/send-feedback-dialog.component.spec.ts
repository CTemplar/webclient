import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendFeedbackDialogComponent } from './send-feedback-dialog.component';

describe('SendFeedbackDialogComponent', () => {
  let component: SendFeedbackDialogComponent;
  let fixture: ComponentFixture<SendFeedbackDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendFeedbackDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendFeedbackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

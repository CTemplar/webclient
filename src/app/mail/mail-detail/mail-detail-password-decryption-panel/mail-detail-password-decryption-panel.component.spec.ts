import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MailDetailPasswordDecryptionPanelComponent } from './mail-detail-password-decryption-panel.component';

describe('MailDetailPasswordDecryptionPanelComponent', () => {
  let component: MailDetailPasswordDecryptionPanelComponent;
  let fixture: ComponentFixture<MailDetailPasswordDecryptionPanelComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MailDetailPasswordDecryptionPanelComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MailDetailPasswordDecryptionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MailDetailDecryptionErrorComponent } from './mail-detail-decryption-error.component';

describe('MailDetailDecryptionErrorComponent', () => {
  let component: MailDetailDecryptionErrorComponent;
  let fixture: ComponentFixture<MailDetailDecryptionErrorComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MailDetailDecryptionErrorComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MailDetailDecryptionErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

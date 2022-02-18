import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MailSettingsComponent } from './mail-settings.component';

describe('MailSettingsComponent', () => {
  let component: MailSettingsComponent;
  let fixture: ComponentFixture<MailSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MailSettingsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MailContactComponent } from './mail-contact.component';

describe('MailContactComponent', () => {
  let component: MailContactComponent;
  let fixture: ComponentFixture<MailContactComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MailContactComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

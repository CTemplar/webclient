import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MailDetailBodyComponent } from './mail-detail-body.component';

describe('MailDetailBodyComponent', () => {
  let component: MailDetailBodyComponent;
  let fixture: ComponentFixture<MailDetailBodyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MailDetailBodyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailDetailBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

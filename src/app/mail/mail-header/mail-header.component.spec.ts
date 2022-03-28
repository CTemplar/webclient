import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MailHeaderComponent } from './mail-header.component';

describe('MailHeaderComponent', () => {
  let component: MailHeaderComponent;
  let fixture: ComponentFixture<MailHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MailHeaderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

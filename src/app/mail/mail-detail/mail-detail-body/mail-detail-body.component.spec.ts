import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailDetailBodyComponent } from './mail-detail-body.component';

describe('MailDetailBodyComponent', () => {
  let component: MailDetailBodyComponent;
  let fixture: ComponentFixture<MailDetailBodyComponent>;

  beforeEach((() => {
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailDetailComponent } from './mail-detail.component';

describe('MailDetailComponent', () => {
  let component: MailDetailComponent;
  let fixture: ComponentFixture<MailDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

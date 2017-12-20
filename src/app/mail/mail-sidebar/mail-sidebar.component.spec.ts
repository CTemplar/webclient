import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailSidebarComponent } from './mail-sidebar.component';

describe('MailSidebarComponent', () => {
  let component: MailSidebarComponent;
  let fixture: ComponentFixture<MailSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

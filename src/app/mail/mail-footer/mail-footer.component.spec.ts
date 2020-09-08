import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailFooterComponent } from './mail-footer.component';

describe('MailFooterComponent', () => {
  let component: MailFooterComponent;
  let fixture: ComponentFixture<MailFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MailFooterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MailListComponent } from './mail-list.component';

describe('MailListComponent', () => {
  let component: MailListComponent;
  let fixture: ComponentFixture<MailListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MailListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

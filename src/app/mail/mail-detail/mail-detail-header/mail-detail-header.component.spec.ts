import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore  } from '@ngrx/store/testing';

import { MailDetailHeaderComponent } from './mail-detail-header.component';

describe('MailDetailHeaderComponent', () => {
  let component: MailDetailHeaderComponent;
  let fixture: ComponentFixture<MailDetailHeaderComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [MailDetailHeaderComponent],
      providers: [provideMockStore({})],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailDetailHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

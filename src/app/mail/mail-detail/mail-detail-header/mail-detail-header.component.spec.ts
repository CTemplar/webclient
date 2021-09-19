import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore  } from '@ngrx/store/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MomentDatePipe } from '../../../shared/pipes/moment-date.pipe';

import { MailDetailHeaderComponent } from './mail-detail-header.component';

describe('MailDetailHeaderComponent', () => {
  let component: MailDetailHeaderComponent;
  let fixture: ComponentFixture<MailDetailHeaderComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [MomentDatePipe, MailDetailHeaderComponent],
      providers: [provideMockStore({}), MomentDatePipe, TranslateService],
      imports: [TranslateModule.forRoot()]
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

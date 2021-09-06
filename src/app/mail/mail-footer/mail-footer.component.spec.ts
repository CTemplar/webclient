import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore  } from '@ngrx/store/testing';

import { MailFooterComponent } from './mail-footer.component';

describe('MailFooterComponent', () => {
  let component: MailFooterComponent;
  let fixture: ComponentFixture<MailFooterComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [MailFooterComponent],
      providers: [provideMockStore({})],
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

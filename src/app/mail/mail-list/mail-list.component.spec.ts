import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore  } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MailListComponent } from './mail-list.component';

describe('MailListComponent', () => {
  let component: MailListComponent;
  let fixture: ComponentFixture<MailListComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [MailListComponent],
      providers: [provideMockStore({})],
      imports: [RouterTestingModule],
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

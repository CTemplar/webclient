import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore  } from '@ngrx/store/testing';
import { HttpClientModule } from '@angular/common/http';
import { MailSidebarComponent } from './mail-sidebar.component';

describe('MailSidebarComponent', () => {
  let component: MailSidebarComponent;
  let fixture: ComponentFixture<MailSidebarComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [MailSidebarComponent],
      providers: [provideMockStore({})],
      imports: [HttpClientModule, RouterTestingModule],
    }).compileComponents();
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

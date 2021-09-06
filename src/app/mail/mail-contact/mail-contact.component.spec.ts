import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore  } from '@ngrx/store/testing';
import { HttpClientModule } from '@angular/common/http';
import { MailContactComponent } from './mail-contact.component';

describe('MailContactComponent', () => {
  let component: MailContactComponent;
  let fixture: ComponentFixture<MailContactComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [MailContactComponent],
      providers: [provideMockStore({})],
      imports: [HttpClientModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

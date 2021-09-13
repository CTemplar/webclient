import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideMockStore  } from '@ngrx/store/testing';
import { ComposeMailService, MessageBuilderService, AutocryptProcessService } from '../store/services';
import { HttpClientModule } from '@angular/common/http';

import { MailComponent } from './mail.component';

describe('MailComponent', () => {
  let component: MailComponent;
  let fixture: ComponentFixture<MailComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [MailComponent],
      providers: [provideMockStore({}), ComposeMailService, MessageBuilderService, AutocryptProcessService],
      imports: [HttpClientModule, MatSnackBarModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

it('should create', () => {
    expect(component).toBeTruthy();
  });
});

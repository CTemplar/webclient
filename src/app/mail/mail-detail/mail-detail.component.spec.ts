import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedService, MessageBuilderService, ComposeMailService, AutocryptProcessService, MessageDecryptService } from '../../store/services';
import { provideMockStore  } from '@ngrx/store/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MailDetailComponent } from './mail-detail.component';
import { TranslateModule } from '@ngx-translate/core';

describe('MailDetailComponent', () => {
  let component: MailDetailComponent;
  let fixture: ComponentFixture<MailDetailComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [MailDetailComponent],
      providers: [provideMockStore({}), SharedService, MessageBuilderService, ComposeMailService, AutocryptProcessService, MessageDecryptService],
      imports: [RouterTestingModule, HttpClientModule, MatSnackBarModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

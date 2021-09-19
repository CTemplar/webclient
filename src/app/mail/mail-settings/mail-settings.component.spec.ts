import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideMockStore  } from '@ngrx/store/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbNavModule, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { OpenPgpService, SharedService } from '../../store/services';
import { MailSettingsComponent } from './mail-settings.component';
import { SharedModule } from '../../shared/shared.module';

describe('MailSettingsComponent', () => {
  let component: MailSettingsComponent;
  let fixture: ComponentFixture<MailSettingsComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [MailSettingsComponent],
      providers: [
        provideMockStore({}),
        NgbPopover,
        OpenPgpService,
        SharedService,
        {
          provide: TranslateLoader,
          useFactory: (http: HttpClient) => new TranslateHttpLoader(http, '/assets/i18n/', '.json'),
          deps: [HttpClient]
        }
      ],
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule, RouterTestingModule, MatSnackBarModule, NgbNavModule, SharedModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

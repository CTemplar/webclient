import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { provideMockStore  } from '@ngrx/store/testing';

import { MailHeaderComponent } from './mail-header.component';
import { AutocryptProcessService, ComposeMailService, MessageBuilderService } from '../../store/services';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('MailHeaderComponent', () => {
  let component: MailHeaderComponent;
  let fixture: ComponentFixture<MailHeaderComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [MailHeaderComponent],
      providers: [provideMockStore({}), MessageBuilderService, ComposeMailService, AutocryptProcessService],
      imports: [RouterTestingModule, TranslateModule.forRoot(), HttpClientModule, MatSnackBarModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

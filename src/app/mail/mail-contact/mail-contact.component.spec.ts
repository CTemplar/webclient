import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutocryptProcessService, ComposeMailService, MessageBuilderService } from '../../store/services';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore  } from '@ngrx/store/testing';
import { HttpClientModule } from '@angular/common/http';
import { MailContactComponent } from './mail-contact.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';

describe('MailContactComponent', () => {
  let component: MailContactComponent;
  let fixture: ComponentFixture<MailContactComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [MailContactComponent],
      providers: [provideMockStore({}), ComposeMailService, MessageBuilderService, AutocryptProcessService],
      imports: [HttpClientModule, RouterTestingModule, MatSnackBarModule, TranslateModule.forRoot(), SharedModule],
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

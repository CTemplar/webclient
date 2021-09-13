import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore  } from '@ngrx/store/testing';
import { HttpClientModule } from '@angular/common/http';
import { MailSidebarComponent } from './mail-sidebar.component';
import { AutocryptProcessService, ComposeMailService, MessageBuilderService, SharedService } from '../../store/services';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';

describe('MailSidebarComponent', () => {
  let component: MailSidebarComponent;
  let fixture: ComponentFixture<MailSidebarComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [MailSidebarComponent],
      providers: [provideMockStore({}), ComposeMailService, MessageBuilderService, SharedService, AutocryptProcessService],
      imports: [HttpClientModule, RouterTestingModule, MatSnackBarModule, TranslateModule.forRoot(), SharedModule],
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

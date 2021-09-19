import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DisplayNameDialogComponent } from './display-name-dialog.component';
import { StoreModule } from '@ngrx/store';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { EmailFormatPipe } from '../../../shared/pipes/email-formatting.pipe';


describe('DisplayNameDialogComponent', () => {
  let component: DisplayNameDialogComponent;
  let fixture: ComponentFixture<DisplayNameDialogComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [EmailFormatPipe, DisplayNameDialogComponent],      
      providers: [
        EmailFormatPipe,
        NgbActiveModal,               
        {
          provide: TranslateLoader,
          useFactory: (http: HttpClient) => new TranslateHttpLoader(http, '/assets/i18n/', '.json'),
          deps: [HttpClient]
        }
      ],      
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule, MatSnackBarModule, StoreModule.forRoot({}), TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserAccountInitDialogComponent } from './user-account-init-dialog.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

describe('UserAccountInitDialogComponent', () => {
  let component: UserAccountInitDialogComponent;
  let fixture: ComponentFixture<UserAccountInitDialogComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [UserAccountInitDialogComponent],      
      providers: [
        NgbActiveModal,
        {
          provide: TranslateLoader,
          useFactory: (http: HttpClient) => new TranslateHttpLoader(http, '/assets/i18n/', '.json'),
          deps: [HttpClient]
        }],      
      imports: [HttpClientModule,
        StoreModule.forRoot({}),
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountInitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StoreModule } from '@ngrx/store';


import { AppComponent } from './app.component';
describe('AppComponent', () => {
  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, '/assets/i18n/', '.json'),
        deps: [HttpClient]
      }],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        StoreModule.forRoot({}),
        TranslateModule.forRoot(),
        ],
    }).compileComponents();
  }));
  it('should create the app', (() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  // it(`should have as title 'app'`, (() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('app');
  // }));
});

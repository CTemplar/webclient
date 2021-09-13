import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore  } from '@ngrx/store/testing';
import { AddressesSignatureComponent } from './addresses-signature.component';
import { OpenPgpService } from '../../../store/services';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

describe('AddressesSignatureComponent', () => {
  let component: AddressesSignatureComponent;
  let fixture: ComponentFixture<AddressesSignatureComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [AddressesSignatureComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule, RouterTestingModule, MatSnackBarModule, TranslateModule.forRoot()],
      providers: [provideMockStore({}), OpenPgpService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressesSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

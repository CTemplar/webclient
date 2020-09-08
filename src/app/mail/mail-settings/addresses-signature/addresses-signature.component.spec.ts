import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressesSignatureComponent } from './addresses-signature.component';

describe('AddressesSignatureComponent', () => {
  let component: AddressesSignatureComponent;
  let fixture: ComponentFixture<AddressesSignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddressesSignatureComponent]
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

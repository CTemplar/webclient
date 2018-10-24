import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOptionsComponent } from './payment-options.component';

describe('PaymentOptionsComponent', () => {
  let component: PaymentOptionsComponent;
  let fixture: ComponentFixture<PaymentOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

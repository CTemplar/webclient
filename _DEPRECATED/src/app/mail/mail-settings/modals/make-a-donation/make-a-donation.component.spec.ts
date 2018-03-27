import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeADonationComponent } from './make-a-donation.component';

describe('MakeADonationComponent', () => {
  let component: MakeADonationComponent;
  let fixture: ComponentFixture<MakeADonationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeADonationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(MakeADonationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesBillingInformationComponent } from './pages-billing-information.component';

describe('PagesBillingInformationComponent', () => {
  let component: PagesBillingInformationComponent;
  let fixture: ComponentFixture<PagesBillingInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagesBillingInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesBillingInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

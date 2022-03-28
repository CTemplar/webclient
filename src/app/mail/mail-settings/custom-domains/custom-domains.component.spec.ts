import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomDomainsComponent } from './custom-domains.component';

describe('CustomDomainsComponent', () => {
  let component: CustomDomainsComponent;
  let fixture: ComponentFixture<CustomDomainsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CustomDomainsComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDomainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

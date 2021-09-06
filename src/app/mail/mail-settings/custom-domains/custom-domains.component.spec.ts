import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore  } from '@ngrx/store/testing';

import { CustomDomainsComponent } from './custom-domains.component';

describe('CustomDomainsComponent', () => {
  let component: CustomDomainsComponent;
  let fixture: ComponentFixture<CustomDomainsComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [CustomDomainsComponent],
      providers: [provideMockStore({})],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDomainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

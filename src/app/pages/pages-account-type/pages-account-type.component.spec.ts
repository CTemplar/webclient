import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesAccountTypeComponent } from './pages-account-type.component';

describe('PagesAccountTypeComponent', () => {
  let component: PagesAccountTypeComponent;
  let fixture: ComponentFixture<PagesAccountTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagesAccountTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesAccountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

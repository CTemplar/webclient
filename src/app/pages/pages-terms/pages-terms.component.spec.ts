import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesTermsComponent } from './pages-terms.component';

describe('PagesTermsComponent', () => {
  let component: PagesTermsComponent;
  let fixture: ComponentFixture<PagesTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagesTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

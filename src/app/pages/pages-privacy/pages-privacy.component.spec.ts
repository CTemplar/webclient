import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesPrivacyComponent } from './pages-privacy.component';

describe('PagesPrivacyComponent', () => {
  let component: PagesPrivacyComponent;
  let fixture: ComponentFixture<PagesPrivacyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagesPrivacyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

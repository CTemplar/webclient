import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesSecurityComponent } from './pages-security.component';

describe('PagesSecurityComponent', () => {
  let component: PagesSecurityComponent;
  let fixture: ComponentFixture<PagesSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagesSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

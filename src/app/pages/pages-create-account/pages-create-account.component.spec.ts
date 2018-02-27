import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesCreateAccountComponent } from './pages-create-account.component';

describe('PagesCreateAccountComponent', () => {
  let component: PagesCreateAccountComponent;
  let fixture: ComponentFixture<PagesCreateAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagesCreateAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesCreateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

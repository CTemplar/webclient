import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesAboutComponent } from './pages-about.component';

describe('PagesAboutComponent', () => {
  let component: PagesAboutComponent;
  let fixture: ComponentFixture<PagesAboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagesAboutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

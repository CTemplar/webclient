import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesOnionComponent } from './pages-onion.component';

describe('PagesOnionComponent', () => {
  let component: PagesOnionComponent;
  let fixture: ComponentFixture<PagesOnionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagesOnionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesOnionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

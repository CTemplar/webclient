import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesTorOnionComponent } from './pages-tor-onion.component';

describe('PagesTorOnionComponent', () => {
  let component: PagesTorOnionComponent;
  let fixture: ComponentFixture<PagesTorOnionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagesTorOnionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesTorOnionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

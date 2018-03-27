import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesMediaKitComponent } from './pages-media-kit.component';

describe('PagesMediaKitComponent', () => {
  let component: PagesMediaKitComponent;
  let fixture: ComponentFixture<PagesMediaKitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagesMediaKitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesMediaKitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

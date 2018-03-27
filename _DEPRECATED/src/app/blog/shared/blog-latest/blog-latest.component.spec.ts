import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogLatestComponent } from './blog-latest.component';

describe('BlogLatestComponent', () => {
  let component: BlogLatestComponent;
  let fixture: ComponentFixture<BlogLatestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogLatestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogLatestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

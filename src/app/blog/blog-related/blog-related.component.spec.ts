import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogRelatedComponent } from './blog-related.component';

describe('BlogRelatedComponent', () => {
  let component: BlogRelatedComponent;
  let fixture: ComponentFixture<BlogRelatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogRelatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogRelatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogSampleComponent } from './blog-sample.component';

describe('BlogSampleComponent', () => {
  let component: BlogSampleComponent;
  let fixture: ComponentFixture<BlogSampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogSampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

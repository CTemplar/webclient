import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PagesDonateComponent } from './pages-donate.component';

describe('PagesDonateComponent', () => {
  let component: PagesDonateComponent;
  let fixture: ComponentFixture<PagesDonateComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PagesDonateComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesDonateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

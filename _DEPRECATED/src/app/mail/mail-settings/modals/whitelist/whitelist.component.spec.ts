import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhitelistComponent } from './whitelist.component';

describe('WhitelistComponent', () => {
  let component: WhitelistComponent;
  let fixture: ComponentFixture<WhitelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhitelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(WhitelistComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailTrashListComponent } from './mail-trash-list.component';

describe('MailTrashListComponent', () => {
  let component: MailTrashListComponent;
  let fixture: ComponentFixture<MailTrashListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailTrashListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailTrashListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

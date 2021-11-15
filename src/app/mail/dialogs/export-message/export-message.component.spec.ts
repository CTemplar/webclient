import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportMessageComponent } from './export-message.component';

describe('ExportMessageComponent', () => {
  let component: ExportMessageComponent;
  let fixture: ComponentFixture<ExportMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExportMessageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

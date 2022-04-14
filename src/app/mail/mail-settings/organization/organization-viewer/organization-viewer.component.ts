import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Organization } from '../../../../store/datatypes';

@Component({
  selector: 'app-organization-viewer',
  templateUrl: './organization-viewer.component.html',
  styleUrls: ['./organization-viewer.component.scss'],
})
export class OrganizationViewerComponent implements OnInit, OnChanges {
  @Input() organization: Organization;

  @Output() upgrade = new EventEmitter();

  @Output() edit = new EventEmitter<Organization>();

  @Output() delete = new EventEmitter<Organization>();

  organizationForm: FormGroup;

  mode = 'view';

  constructor(private formBuilder: FormBuilder) {}

  ngOnChanges() {
    this.initForm();
  }

  ngOnInit() {}

  initForm() {
    const { name } = this.organization;
    this.organizationForm = this.formBuilder.group({
      name: [
        name,
        [
          Validators.required,
          Validators.pattern(/^[a-z]+([\da-z]*[._-]?[\da-z]+)+$/i),
          Validators.minLength(4),
          Validators.maxLength(64),
        ],
      ],
    });
  }

  gotoPricingPlans() {
    this.upgrade.emit();
  }

  onEditClick() {
    this.initForm();
    this.mode = 'edit';
  }

  onDeleteClick() {
    this.delete.emit(this.organization);
  }

  onCancelClick() {
    this.mode = 'view';
  }

  onSave(event: any) {
    event.preventDefault();
    this.organizationForm.markAllAsTouched();
    if (this.organizationForm.valid) {
      this.edit.emit(this.organizationForm.value);
      this.mode = 'view';
    }
  }
}

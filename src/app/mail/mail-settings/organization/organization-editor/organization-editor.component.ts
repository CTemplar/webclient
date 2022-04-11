import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Organization } from '../../../../store/datatypes';

@Component({
  selector: 'app-organization-editor',
  templateUrl: './organization-editor.component.html',
  styleUrls: ['./organization-editor.component.scss'],
})
export class OrganizationEditorComponent implements OnInit {
  @Input() mode: 'add' | 'edit' = 'add';

  @Input() organization: Organization;

  @Input() domainOptions: any[] = [];

  @Output() cancel = new EventEmitter();

  @Output() save = new EventEmitter<Organization>();

  domainNameForm: FormGroup;

  organizationNameForm: FormGroup;

  passwordForm: FormGroup;

  currentStep = 0;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.organizationNameForm = this.formBuilder.group({
      name: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[a-z]+([\da-z]*[._-]?[\da-z]+)+$/i),
          Validators.minLength(4),
          Validators.maxLength(64),
        ],
      ],
    });
    this.domainNameForm = this.formBuilder.group({
      custom_domain: [null, Validators.required],
    });
  }

  gotoStep2() {
    this.organizationNameForm.markAllAsTouched();
    if (this.organizationNameForm.valid) {
      this.currentStep = 1;
    }
  }

  onSaveClick() {
    this.organizationNameForm.markAllAsTouched();
    this.domainNameForm.markAllAsTouched();
    if (this.organizationNameForm.valid && this.domainNameForm.valid) {
      const toSave: Organization = { ...this.organizationNameForm.value, ...this.domainNameForm.value };
      this.save.emit(toSave);
    }
  }

  onCancelClick() {
    this.cancel.emit();
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-organization-brief-section',
  templateUrl: './organization-brief-section.component.html',
  styleUrls: ['./organization-brief-section.component.scss'],
})
export class OrganizationBriefSectionComponent implements OnInit {
  @Output() next = new EventEmitter();

  organizationForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.organizationForm = this.formBuilder.group({
      organizationName: ['', Validators.required],
    });
  }
}

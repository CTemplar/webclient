import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/datatypes';

@Component({
  selector: 'app-mail-filters',
  templateUrl: './mail-filters.component.html',
  styleUrls: ['../mail-settings.component.scss']
})
export class MailFiltersComponent implements OnInit {

  @ViewChild('customFilterModal') customFilterModal;

  private customFilterModalRef: NgbModalRef;

  constructor(private store: Store<AppState>,
              private formBuilder: FormBuilder,
              private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  openCustomFilterModal(selectedFilter?: any) {
    this.customFilterModalRef = this.modalService.open(this.customFilterModal, {
      centered: true,
      windowClass: 'modal-sm'
    });
  }

}

import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbDatepicker, NgbDateStruct, NgbModal, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { SaveAutoResponder, SnackErrorPush } from '../../../store/actions';
import { AppState, AutoResponder, Settings, UserState } from '../../../store/datatypes';
import { DateTimeUtilService } from '../../../store/services/datetime-util.service';
import { CKEDITOR_TOOLBAR_ITEMS } from '../../../shared/config';
import * as DecoupledEditor from '../../../../assets/js/ckeditor-build/ckeditor';

@UntilDestroy()
@Component({
  selector: 'app-mail-autoresponder',
  templateUrl: './mail-autoresponder.component.html',
  styleUrls: ['./mail-autoresponder.component.scss', '../mail-settings.component.scss'],
})
export class MailAutoresponderComponent implements OnInit, OnDestroy {
  @ViewChild('startDatePicker') startDatePicker: NgbDatepicker;

  @ViewChild('endDatePicker') endDatePicker: NgbDatepicker;

  public DecoupledEditor = DecoupledEditor;

  public CKEDITOR_TOOLBAR_ITEMS = CKEDITOR_TOOLBAR_ITEMS;

  userState: UserState;

  settings: Settings;

  autoresponder: AutoResponder = {};

  startTime: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };

  endTime: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };

  startDate: NgbDateStruct;

  endDate: NgbDateStruct;

  errorMessage: string;

  @Output() onAnchored = new EventEmitter<any>();

  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private dateTimeUtilService: DateTimeUtilService,
  ) {}

  ngOnInit() {
    this.store
      .select(state => state.user)
      .pipe(untilDestroyed(this))
      .subscribe((user: UserState) => {
        this.userState = user;
        this.settings = user.settings;
        if (user.autoresponder) {
          this.autoresponder = user.autoresponder;
          this.initData(this.autoresponder);
        }
        this.errorMessage = user.autoResponderErrorMessage;
      });
  }

  ngOnDestroy(): void {}

  /**
   * initialize Autoresponder time and date from user's autoresponder status
   */
  initData(autoresponder: AutoResponder) {
    if (autoresponder) {
      this.startTime = autoresponder.start_time
        ? this.dateTimeUtilService.getNgbTimeStructFromTimeStr(autoresponder.start_time, 'HH:mm:ss')
        : { hour: 0, minute: 0, second: 0 };
      this.endTime = autoresponder.end_time
        ? this.dateTimeUtilService.getNgbTimeStructFromTimeStr(autoresponder.end_time, 'HH:mm:ss')
        : { hour: 0, minute: 0, second: 0 };
      this.startDate = autoresponder.start_date
        ? this.dateTimeUtilService.getNgbDateStructFromDateStr(autoresponder.start_date, 'YYYY-MM-DD')
        : null;
      this.endDate = autoresponder.end_date
        ? this.dateTimeUtilService.getNgbDateStructFromDateStr(autoresponder.end_date, 'YYYY-MM-DD')
        : null;
      if (this.startDate && this.startDatePicker) {
        this.startDatePicker.navigateTo(this.startDate);
      }
      if (this.endDate && this.endDatePicker) {
        this.endDatePicker.navigateTo(this.endDate);
      }
    }
  }

  public onEditorReady(editor: any, isVacation = false) {
    if (isVacation) {
      const toolbarContainer = document.querySelector('.vacation-autoresponder-editor-toolbar-container');
      toolbarContainer.append(editor.ui.view.toolbar.element);
    } else {
      const toolbarContainer = document.querySelector('.autoresponder-editor-toolbar-container');
      toolbarContainer.append(editor.ui.view.toolbar.element);
    }
  }

  save() {
    // save user's choice for autoresponder
    if (this.autoresponder.is_time_range_restricted) {
      this.autoresponder.start_time = this.dateTimeUtilService.createTimeStrFromNgbTimeStruct(
        this.startTime,
        'HH:mm:ss',
      );
      this.autoresponder.end_time = this.dateTimeUtilService.createTimeStrFromNgbTimeStruct(this.endTime, 'HH:mm:ss');
      if (this.dateTimeUtilService.isBefore(this.autoresponder.end_time, this.autoresponder.start_time, 'HH:mm:ss')) {
        this.store.dispatch(new SnackErrorPush({ message: 'End time cannot be before start time.' }));
        return;
      }
    }
    if (this.autoresponder.vacationautoresponder_active) {
      this.autoresponder.start_date = this.startDate
        ? this.dateTimeUtilService.createDateStrFromNgbDateStruct(this.startDate, 'YYYY-MM-DD')
        : null;
      this.autoresponder.end_date = this.endDate
        ? this.dateTimeUtilService.createDateStrFromNgbDateStruct(this.endDate, 'YYYY-MM-DD')
        : null;
      if (
        this.autoresponder.end_date &&
        this.autoresponder.start_date &&
        this.dateTimeUtilService.isBefore(this.autoresponder.end_date, this.autoresponder.start_date)
      ) {
        this.store.dispatch(new SnackErrorPush({ message: 'End date cannot be before start date.' }));
        return;
      }
    }
    this.store.dispatch(new SaveAutoResponder(this.autoresponder));
  }

  onAnchoredLink(id: string) {
    // this.onAnchored.emit(id);
    const elmnt = document.getElementById(id);
    elmnt.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }
}

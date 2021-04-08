import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Mailbox } from '../../../store/models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { SnackErrorPush } from '../../../store';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/datatypes';
import { OpenPgpService } from '../../../store/services';

enum ImportPrivateKeyStep {
  SELECT_MAILBOX,
  SELECT_PRIVATE_KEY,
  INPUT_PRIVATE_KEY_PASSWORD,
  INPUT_USER_PASSWORD,
}

@Component({
  selector: 'app-import-private-key',
  templateUrl: './import-private-key.component.html',
  styleUrls: ['./import-private-key.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportPrivateKeyComponent implements OnInit {
  @Input() mailboxes: Mailbox[] = [];

  selectedMailbox: Mailbox;

  ImportPrivateKeyStep = ImportPrivateKeyStep;

  currentStep: ImportPrivateKeyStep = ImportPrivateKeyStep.SELECT_MAILBOX;

  isImportingKey = false;

  currentFile: File;

  constructor(public activeModal: NgbActiveModal, private store: Store<AppState>, private openpgp: OpenPgpService) {}

  ngOnInit(): void {
    if (this.mailboxes.length > 0) {
      [this.selectedMailbox] = this.mailboxes;
    }
  }

  onSelectMailbox(selectedMailbox: Mailbox) {
    this.selectedMailbox = selectedMailbox;
  }

  onSelectNewKeyFile(files: Array<File>) {
    if (files.length > 1) return;
    if (files && files.length > 0) {
      const file = files[0];
      this.currentFile = file;
    }
  }

  parsePrivateKey() {
    if (this.currentFile) {
      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        const { result } = event.target;
        this.openpgp
          .decryptPrivateKey(result)
          .pipe(take(1))
          .subscribe(
            data => {
              this.isImportingKey = false;
              debugger
            },
            error => {
              debugger
              this.isImportingKey = false;
              this.store.dispatch(
                new SnackErrorPush({
                  message: `${this.currentFile.name} is not a valid PGP Private Key`,
                }),
              );
            },
          );
      });
      reader.readAsText(this.currentFile);
    }
  }

  onNext() {
    if (this.currentStep !== ImportPrivateKeyStep.INPUT_USER_PASSWORD) {
      this.currentStep += 1;
    }
  }

  onHide() {
    this.activeModal.close();
  }
}

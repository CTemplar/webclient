import { Component, Input, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Contact } from '../../../../store/datatypes';
import { Mailbox } from '../../../../store/models';
import * as parseEmail from 'email-addresses';

@Component({
  selector: 'app-receiver-email-chip',
  templateUrl: './receiver-email-chip.component.html',
  styleUrls: ['./receiver-email-chip.component.scss'],
})
export class ReceiverEmailChipComponent implements OnInit {
  @ViewChild('addUserContent') addUserContent: any;

  @Input() composePopover: boolean = true;

  @Input() email: string;

  @Input() name: string = '';

  @Input() contacts: Contact[];

  @Input() isContactEncrypted: boolean;

  @Input() mailboxes: Mailbox[] = [];

  selectedContact: Contact;

  isMyMailbox = false;

  isValidEmail = true;

  /**
   * This contact will be transferred to save contact component
   */
  passingContact: Contact;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  ngOnChanges(simpleChange: SimpleChanges): void {
    this.selectedContact = this.contacts.find(contact => this.email === contact.email);
    if (!this.composePopover && this.mailboxes.length > 0) {
      this.mailboxes.forEach(mailbox => {
        if (mailbox.email === this.email) {
          this.isMyMailbox = true;
        }
      });
    }
    this.isValidEmail = this.rfcStandardValidateEmail(this.email);
  }

  onAddContact(popOver: any, addUserContent: TemplateRef<any>) {
    this.passingContact = {
      email: this.email,
      name: this.email,
    };
    this.modalService.open(addUserContent, {
      centered: true,
      windowClass: 'modal-sm users-action-modal',
      beforeDismiss: () => {
        return true;
      },
    });
  }

  onEditContact(popOver: any, addUserContent: TemplateRef<any>) {
    this.passingContact = this.selectedContact;
    this.modalService.open(addUserContent, {
      centered: true,
      windowClass: 'modal-sm users-action-modal',
      beforeDismiss: () => {
        return true;
      },
    });
  }

  onClickBody(popOver: any) {
    popOver.isOpen() ? popOver.close() : popOver.open();
  }

  rfcStandardValidateEmail(address: string): boolean {
    return !!parseEmail.parseOneAddress(address);
  }
}

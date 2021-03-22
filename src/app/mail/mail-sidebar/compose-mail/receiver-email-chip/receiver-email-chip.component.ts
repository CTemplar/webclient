import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { Contact } from '../../../../store/datatypes';

@Component({
  selector: 'app-receiver-email-chip',
  templateUrl: './receiver-email-chip.component.html',
  styleUrls: ['./receiver-email-chip.component.scss'],
})
export class ReceiverEmailChipComponent implements OnInit {
  @Input() email: string;

  @Input() contacts: any[] = [];

  selectedContact: any;

  constructor() {}

  ngOnInit(): void {
    this.selectedContact = this.contacts.find(contact => this.email === contact.email);
  }
}

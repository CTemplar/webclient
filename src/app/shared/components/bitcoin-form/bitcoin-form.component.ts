import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bitcoin-form',
  templateUrl: './bitcoin-form.component.html',
  styleUrls: ['./bitcoin-form.component.scss']
})
export class BitcoinFormComponent implements OnInit {

  // donationAmount : The amount user wants to donate to CTemplar
  donationAmount: number;

  // Display loader on form submission
  inProgress = false;

  constructor() { }

  ngOnInit() {
  }

  submitForm() {
  }

}

import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'img-spinner',
  templateUrl: './spinner.component.pug',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  isLoaded: boolean = false;
  @Input() src: string;
  @Input() class: string;

  constructor() { }

  ngOnInit() {
  }

}

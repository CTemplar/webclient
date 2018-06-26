import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner-image',
  templateUrl: './spinner-image.component.html',
  styleUrls: ['./spinner-image.component.scss']
})
export class SpinnerImageComponent implements OnInit {
  isLoaded: boolean = false;
  @Input() src: string;
  @Input() class: string;

  constructor() {
  }

  ngOnInit() {
  }

}

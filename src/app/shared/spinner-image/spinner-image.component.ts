import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner-image',
  templateUrl: './spinner-image.component.html',
  styleUrls: ['./spinner-image.component.scss']
})
export class SpinnerImageComponent implements OnInit {
  isLoaded = false;
  @Input() src: string;
  @Input() class: string;

  constructor() {}

  ngOnInit() {}
}

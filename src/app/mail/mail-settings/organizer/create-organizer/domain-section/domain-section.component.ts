import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Domain } from '../../../../../store/datatypes';

@Component({
  selector: 'app-domain-section',
  templateUrl: './domain-section.component.html',
  styleUrls: ['./domain-section.component.scss'],
})
export class DomainSectionComponent implements OnInit {
  @Input() domains: Domain[] = [];

  @Output() next = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}

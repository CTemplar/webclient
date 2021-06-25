import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
})
export class AdvancedSearchComponent implements OnInit {
  startDate = '';

  endDate = '';

  SEARCH_SIZE = {
    GTE: 'Greater than',
    LTE: 'Less than',
    EQUALS: 'Equal',
  };

  size = 'GTE';

  ngOnInit(): void {}

  onChangeSize($event: any, size: string) {
    $event.preventDefault();
    this.size = size;
    console.log('aaaaaaaaaa', this.size);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { apiUrl } from '../../shared/config';
import { Timezone } from '../datatypes';

@Injectable({
  providedIn: 'root',
})
export class TimezoneService {
  constructor(private http: HttpClient) {}

  getTimezones() {
    return this.http.get<Timezone[]>(`${apiUrl}data/timezones/`).pipe(map((item: any) => item.timezones));
  }
}

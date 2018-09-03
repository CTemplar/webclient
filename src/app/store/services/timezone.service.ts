import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../shared/config';
import { Timezone } from '../datatypes';

@Injectable()
export class TimezoneService {
  constructor(private http: HttpClient) {}

  getTimezones() {
    return this.http.get<Timezone[]>(`${apiUrl}data/timezones/`).map((item: any) => item.timezones);
  }
}

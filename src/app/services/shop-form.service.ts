import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {
  baseUrl = environment.baseUrl;
  private countriesUrl = `${this.baseUrl}/countries`;
  private statesUrl =  `${this.baseUrl}/states`;

  constructor(private _httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this._httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.country)
    );
  }

  getStates(countryCode: string): Observable<State[]> {
    return this._httpClient.get<GetResponseStates>(`${this.statesUrl}/search/findByCountryCode?code=${countryCode}`).pipe(
      map(response => response._embedded.states)
    );
  }


  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data  = [];

    for (let month = startMonth;month<=12; month++) {
      data.push(month);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data  = [];

    const startYear = new Date().getFullYear();
    const endYear = startYear+10;

    for(let theYear = startYear; theYear < endYear; theYear++) {
      data.push(theYear);
    }
    return of(data);
  }
}


interface GetResponseCountries {
  _embedded: {
    country: Country[];
  }
}


interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}
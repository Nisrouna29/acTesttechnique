import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ISelectorOption } from '../models/selector.option';

@Injectable({
  providedIn: 'root'
})
export class SelectorOptionsService {
  private apiUrl = 'https://ac-project-62efb-default-rtdb.firebaseio.com';
  constructor(private http: HttpClient) { }

 //get all options, somtimes when use get Rest api in firebase, the response could be an array or object
  getOptions(): Observable<ISelectorOption[]> {
    return this.http.get<Record<string, ISelectorOption>>(`${this.apiUrl}/options.json`).pipe(
      map(response => {
        // If response is null or undefined, return empty array
        if (!response) {
          console.warn('Response is null or undefined, returning empty array');
          return [];
        }
        // If response is already an array, return it
        if (Array.isArray(response)) return response;

        // If response is an object, convert to array
        return Object.keys(response).map(key => {
          const option = response[key];
          if (!option) {
            return null;
          }
          return {
            id: option.id,
            label: option.label ?? null,
            value: option.value ?? null,
            type: option.type ?? null,
          };
        }).filter((selector: ISelectorOption | null) => selector !== null) as ISelectorOption[];
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error.error);
        return throwError(() => new Error('Failed retrieve options.'));
      })
    );
  }
}

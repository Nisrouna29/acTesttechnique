import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Selector } from '../models/selector';

@Injectable({
  providedIn: 'root'
})
export class SelectoService {
   private apiUrl = 'https://ac-project-62efb-default-rtdb.firebaseio.com';
   constructor(private http: HttpClient) { }
   getOptions(): Observable<Selector[]> {
     return this.http.get<Selector[]>(`${this.apiUrl}/selectors.json`);
   }
}

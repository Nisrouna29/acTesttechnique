import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { Box, IBox } from '../models/box';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ISelectorOption } from '../models/selector.option';

@Injectable({
  providedIn: 'root'
})
export class BoxService {
  private apiUrl = 'https://ac-project-62efb-default-rtdb.firebaseio.com';
  // current id selected box that we are going to share between components
  private idSelectedBox = new BehaviorSubject<number | null>(null);
  // updated boxes that we are going to share between components
  private boxes = new BehaviorSubject<Map<number, Box>>(new Map());
  public idSelectedBox$ = this.idSelectedBox.asObservable();
  public boxes$ = this.boxes.asObservable();

  constructor(private http: HttpClient) {
    this.loadBoxes();
  }
  loadBoxes() {
    this.getAllboxes().subscribe((boxes: Box[]) => {
      let mapboxes = this.initMap();
      if (boxes) {
        for (let box of boxes) {
          if (box && box.id && box.id >= 1 && box.id <= 10) {
            mapboxes.set(box.id, box);
          }
        }
      }
      this.boxes.next(mapboxes);
    });
  }

  initMap(): Map<number, Box> {
    let map = new Map<number, Box>();
    for (let i = 1; i <= 10; i++) {
      map.set(i, new Box(i, null, null, null));
    }
    return map;
  }

  updateSelectedBox(idSelectedBox: number) {
    this.idSelectedBox.next(idSelectedBox);
  }
  updateBoxes(boxes: Map<number, Box>) {
    this.boxes.next(boxes);
  }

  //get all boxes, sometimes when use get Rest api in firebase, the response could be an array or object
  getAllboxes(): Observable<IBox[]> {
    return this.http.get<Record<string, IBox>>(`${this.apiUrl}/boxes.json`).pipe(
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
          const box = response[key];
          if (!box) {
            return null;
          }
          return {
            id: box.id,
            idSelectorOption: box.idSelectorOption ?? null,
            label: box.label ?? null,
            value: box.value ?? null,
          };
        }).filter((box: IBox | null) => box !== null) as IBox[];
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error.error);
        return throwError(() => new Error('Failed retrieve boxes.'));
      })
    );
  }
 // delete all boxes
  deleteAllboxes(): Observable<any> {
    const currentIdSelectedBox = this.idSelectedBox.getValue();
    return this.http.delete(`${this.apiUrl}/boxes.json`).pipe(tap(() => {
      //refresh current boxes
      this.boxes.next(this.initMap());
      this.idSelectedBox.next(currentIdSelectedBox);
    }), catchError((error: HttpErrorResponse) => {
      console.error('An error occurred:', error.error);
      return throwError(() => new Error('Failed to delete boxes.'));
    }))
  }

  // this patch method is going to create or modify a box
  patchBox(option: ISelectorOption): Observable<any> {
    const currentIdSelectedBox = this.idSelectedBox.getValue();
    const currentBoxes = this.boxes.getValue();
    if (currentIdSelectedBox !== null) {
      const box = new Box(currentIdSelectedBox, option.id, option.label, option.value,)
      return this.http.patch(`${this.apiUrl}/boxes/${box.id}.json`, box).pipe(tap(() => {
        //update map of boxes
        currentBoxes.set(currentIdSelectedBox, box);
        this.updateBoxes(currentBoxes);
        // if currentIdSelectedBox < 10 the next selected box has id = id + 1
        if (currentIdSelectedBox < 10) {
            this.idSelectedBox.next(currentIdSelectedBox + 1);
        }
      }), catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error.error);
        return throwError(() => new Error('Failed to patch box.'));
      }))
    }
    return throwError(() => new Error('box with id null'));
  }

}

import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, map, Observable, of, tap, throwError } from 'rxjs';
import { Box, IBox } from '../models/box';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Selector } from '../models/selector';

@Injectable({
  providedIn: 'root'
})
export class BoxService {
  private apiUrl = 'https://ac-project-62efb-default-rtdb.firebaseio.com';
  // current selected box that we are going to share between components
  private selectedBox = new BehaviorSubject<Box | null>(null);
  // updated boxes that we are going to share between components
  private boxes = new BehaviorSubject<Map<number, Box>>(new Map());
  public selectedBox$ = this.selectedBox.asObservable();
  public boxes$ = this.boxes.asObservable();

  constructor(private http: HttpClient) {
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

  updateSelectedBox(box: Box) {
    this.selectedBox.next(box);
  }
  updateBoxes(boxes: Map<number, Box>) {
    this.boxes.next(boxes);
  }

  // we are receiving a json object when call get request, this function is going to transform it to an array
  getAllboxes(): Observable<IBox[]> {
    return this.http.get<Record<string, IBox>>(`${this.apiUrl}/boxes.json`).pipe(
      map(response => {
        if (!response) {
          console.warn('Response is null or undefined, returning empty array');
          return [];
        }
        return Object.keys(response).map(key => {
          const box = response[key];
          if (!box) {
            return null;
          }
          return {
            id: box.id,
            idSelector: box.idSelector ?? null,
            label: box.label ?? null,
            value: box.value ?? null,
          };
        }).filter((box: IBox | null) => box !== null) as IBox[];
      })
    );
  }
 // delete all boxes
  deleteAllboxes(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/boxes.json`).pipe(tap(() => {
      //refresh current boxes if
      this.boxes.next(this.initMap());
      let selectBox = this.selectedBox.getValue();
      if (selectBox != null) {
        this.selectedBox.next(new Box(selectBox.id, null, null, null))
      }
    }), catchError((error: HttpErrorResponse) => {
      console.error('An error occurred:', error.error);
      return throwError(() => new Error('Failed to delete boxes.'));
    }))
  }

  // this patch method is going to create or modify a box
  patchBox(selector: Selector): Observable<any> {
    let currentBox = this.selectedBox.getValue();
    let currentBoxes = this.boxes.getValue();
    if (currentBox && currentBox.id) {
      let box = new Box(currentBox.id, selector.id, selector.label, selector.value,)
      return this.http.patch(`${this.apiUrl}/boxes/${box.id}.json`, box).pipe(tap(() => {
        //update map of boxes
        currentBoxes.set(currentBox.id, box);
        this.updateBoxes(currentBoxes);
        // if currentBox.id < 10 the next selected box has id = id + 1
        if (currentBox.id < 10) {
          let nextBox = currentBoxes.get(currentBox.id + 1)
          if (nextBox) {
            this.selectedBox.next(nextBox);
          }
        } else if (currentBox.id === 10) {
          this.selectedBox.next(box);
        }
      }), catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error.error);
        return throwError(() => new Error('Failed to patch box.'));
      }))
    }
    return throwError(() => new Error('box with id null'));
  }

}

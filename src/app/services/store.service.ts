
import {pluck, distinctUntilChanged} from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { BehaviorSubject ,  Observable } from 'rxjs';



import { COMPANY } from '../models/company';

interface State {
  user: any;
  companies: COMPANY[];
  company: COMPANY;
  people: any;
  scenarios: any;
  selectedUserIds: string[];
}

const state: State = {
  user: null,
  companies: null,
  company: null,
  people: null,
  scenarios: null,
  selectedUserIds: null
};

@Injectable()
export class StoreService {

  private subject = new BehaviorSubject<State>(state);
  private store = this.subject.asObservable().pipe(distinctUntilChanged());

  get value() {
    return this.subject.value;
  }

  select<T>(name: string): Observable<T> {
    return (this.store.pipe(pluck(name)) as Observable<T>).pipe(distinctUntilChanged<T>());
  }

  set(name: string, payload: any) {
    this.subject.next({
      ...this.value, [name]: payload
    });
  }

}

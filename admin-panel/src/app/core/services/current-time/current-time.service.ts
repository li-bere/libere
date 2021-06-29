import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class CurrentTimeService {

  constructor() { }

  getCurrentTime() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }
}

import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';

import { FeeI } from '@app/core/models/fee';

@Injectable({
  providedIn: 'root'
})
export class FeeService {

  constructor(
    private afStore: AngularFirestore
  ) { }

  getFee(name: string) {
    return this.afStore.collection<FeeI>('fees').doc(name).valueChanges();
  }
}

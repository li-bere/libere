import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';

import { QuotaI } from '@app/core/models/quota';

@Injectable({
  providedIn: 'root'
})
export class QuotaService {

  constructor(
    private afStore: AngularFirestore
  ) { }

  getQuota(name: string) {
    return this.afStore.collection<QuotaI>('credit-quotas').doc(name).valueChanges();
  }
}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { QuotaI } from '../../models/quota';
import { CurrentTimeService } from '../current-time/current-time.service';

@Injectable({
  providedIn: 'root'
})
export class QuotaService {

  constructor(private afStore: AngularFirestore, private currentTimeService: CurrentTimeService) { }

  getQuotas() {
    let data = this.afStore.collection("credit-quotas").snapshotChanges();

    return data.pipe(
      map((actions) =>
        actions.map((a) => {
          let data = a.payload.doc.data() as QuotaI;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  updateQuota(data) {
    let feeData = {
      value: parseInt(data.value),
      createdAt: this.currentTimeService.getCurrentTime(),
      updatedAt: this.currentTimeService.getCurrentTime(),
    };

    let newFeeRef = this.afStore.doc(`credit-quotas/${data.name}`);
    return newFeeRef.set(feeData, { merge: true });
  }

  deleteQuota(id) {
    let feeRef = this.afStore.doc(`credit-quotas/${id}`);
    return feeRef.delete();
  }

  getQuota(name: string) {
    return this.afStore.collection<QuotaI>("credit-quotas").doc(name).valueChanges();
  }
}

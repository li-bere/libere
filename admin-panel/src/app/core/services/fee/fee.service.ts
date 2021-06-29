import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";

import { FeeI } from "../../models/fee";

import { CurrentTimeService } from "./../current-time/current-time.service";

@Injectable({
  providedIn: "root",
})
export class FeeService {
  constructor(
    private afStore: AngularFirestore,
    private currentTimeService: CurrentTimeService
  ) {}

  getFees() {
    let data = this.afStore.collection("fees").snapshotChanges();

    return data.pipe(
      map((actions) =>
        actions.map((a) => {
          let data = a.payload.doc.data() as FeeI;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  updateFee(data) {
    let feeData = {
      value: parseInt(data.value),
      createdAt: this.currentTimeService.getCurrentTime(),
      updatedAt: this.currentTimeService.getCurrentTime(),
    };

    let newFeeRef = this.afStore.doc(`fees/${data.name}`);
    return newFeeRef.set(feeData, { merge: true });
  }

  deleteFee(id) {
    let feeRef = this.afStore.doc(`fees/${id}`);
    return feeRef.delete();
  }

  getFee(name: string) {
    return this.afStore.collection<FeeI>("fees").doc(name).valueChanges();
  }
}

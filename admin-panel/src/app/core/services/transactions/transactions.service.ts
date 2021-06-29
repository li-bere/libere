import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { TransactionI } from '../../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor(private afStore: AngularFirestore) { }

  getTransactions() {
    let data = this.afStore.collection("transactions").snapshotChanges();

    return data.pipe(map(actions => actions.map(a => {
      let data = a.payload.doc.data() as TransactionI;
      const id = a.payload.doc.id;
      return { id, ...data };
    })))
  }

  getTransaction(id) {
    return this.afStore.doc<TransactionI>(`transactions/${id}`).valueChanges();
  }

  deleteTransaction(id) {
    const transactionRef = this.afStore.doc(`transactions/${id}`);
    return transactionRef.delete();
  }
}

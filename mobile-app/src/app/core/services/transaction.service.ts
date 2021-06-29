import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';

import { map } from 'rxjs/operators';

import { TransactionI } from '@app/core/models/transaction';
import { AuthService } from '@app/core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(
    private afStore: AngularFirestore,
    public functions: AngularFireFunctions,
    private authService: AuthService
  ) {}

  getTransactions(type = null, reason = null, limit = null, shopId = null) {
    console.log('type is', type);
    console.log('reason is',reason);
    const uid = this.authService.currentUserId;
    let query = this.afStore.collection('transactions', (ref) =>
      ref.where('to', '==', uid).orderBy('createdAt', 'desc')
    );
    if (type && reason && shopId) {
      query = this.afStore.collection('transactions', (ref) =>
        ref
          .where('shopId', '==', shopId)
          .where('type', '==', type)
          .where('reason', '==', reason)
          .orderBy('createdAt', 'desc')
      );
    }
    else if (type && reason && limit) {
      query = this.afStore.collection('transactions', (ref) =>
        ref
          .where('to', '==', uid)
          .where('type', '==', type)
          .where('reason', '==', reason)
          .orderBy('createdAt', 'desc')
          .limit(3)
      );
    } else if (type && reason) {
      query = this.afStore.collection('transactions', (ref) =>
        ref
          .where('to', '==', uid)
          .where('type', '==', type)
          .where('reason', '==', reason)
          .orderBy('createdAt', 'desc')
      );
    } else if (type) {
      query = this.afStore.collection('transactions', (ref) =>
        ref.where('to', '==', uid).where('type', '==', type).orderBy('createdAt', 'desc')
      );
    } else if (reason) {
      query = this.afStore.collection('transactions', (ref) =>
        ref.where('to', '==', uid).where('reason', '==', reason).orderBy('createdAt', 'desc')
      );
    }
    return query.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as TransactionI;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }
  getShopTransactions(shopId ,type = null, reason = null, limit = null) {
    const uid = this.authService.currentUserId;
    let query = this.afStore.collection('transactions', (ref) =>
      ref.where('shopId', '==', shopId)
      .where('to', '==', uid)
      .orderBy('createdAt', 'desc')
    );
    if (type && reason && shopId) {
      query = this.afStore.collection('transactions', (ref) =>
        ref
          .where('shopId', '==', shopId)
          .where('type', '==', type)
          .where('reason', '==', reason)
          .orderBy('createdAt', 'desc')
      );
    }
    else if (type && reason && limit) {
      query = this.afStore.collection('transactions', (ref) =>
        ref
          .where('to', '==', uid)
          .where('type', '==', type)
          .where('reason', '==', reason)
          .orderBy('createdAt', 'desc')
          .limit(3)
      );
    } else if (type && reason) {
      query = this.afStore.collection('transactions', (ref) =>
        ref
          .where('to', '==', uid)
          .where('type', '==', type)
          .where('reason', '==', reason)
          .orderBy('createdAt', 'desc')
      );
    } else if (type) {
      query = this.afStore.collection('transactions', (ref) =>
        ref.where('to', '==', uid).where('type', '==', type).orderBy('createdAt', 'desc')
      );
    } else if (reason) {
      query = this.afStore.collection('transactions', (ref) =>
        ref.where('to', '==', uid).where('reason', '==', reason).orderBy('createdAt', 'desc')
      );
    }
    return query.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as TransactionI;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  getLastTransactions() {
    const uid = this.authService.currentUserId;
    return this.afStore.collection<any>(`transactions`, ref =>
    ref.where('to', '==', uid)
    .orderBy("createdAt", 'desc')
    .limit(5))
    .valueChanges();
  }

  getLastOneTransaction() {
    const uid = this.authService.currentUserId;
    return this.afStore.collection<any>(`transactions`, ref =>
    ref.where('to', '==', uid)
    .orderBy("createdAt", 'desc')
    .limit(1))
    .valueChanges();
  }


  getUserRefillTransactions() {
    const uid = this.authService.currentUserId;
    return this.afStore.collection<any>(`transactions`, ref =>
    ref.where('to', '==', uid)
    .where('reason', '==', 'refill'))
    .valueChanges();
  }
  getallRefillTransactions() {
    const uid = this.authService.currentUserId;
    return this.afStore.collection<any>(`transactions`, ref =>
    ref.where('to', '==', uid)
    .where('reason', '==', 'refill'))
    .valueChanges();
  }

  getTransaction(id) {
    const transactionData = this.afStore.collection('transactions').doc(id).valueChanges();
    return transactionData;
  }

  refillBottle(data: any) {
    const callable = this.functions.httpsCallable('bottleRefill');
    return callable(data);
  }

  buy(data: any) {
    const callable = this.functions.httpsCallable('buy');
    return callable(data);
  }

  changeBuyStatus(data: any) {
    const callable = this.functions.httpsCallable('updateBuy');
    return callable(data);
  }

  // getTransaction(id) {
  //   const transactionData: AngularFirestoreDocument = this.afStore.doc(`transactions/${id}`);
  //   return transactionData.valueChanges();
  // }

  // getFifteenDaysBeforeTransactionsWithoutAcceptReject() {
  //   const previousHour = new Date().getTime() - (15 * 24 * 3600 * 1000);
  //   const allTransactions = this.afStore.collection(`transactions`, ref =>
  //   ref.where('status', '==', 'PENDING')
  //     // .where('shopkeeperUid', '==', this.authService.currentUserId)
  //     // .orderBy('createdAt', 'desc')
  //     .where('createdAt' , '<=' , new Date(previousHour))
  //     ).valueChanges();
  //   return allTransactions;
  // }

  getCurrentlyCreatedRefillTransaction() {
    const aTransaction = this.afStore.collection(`transactions`, ref =>
    ref.where('userUid', '==', this.authService.currentUserId)
    .where('type', '==', 'debit')
    .where('to', '==', this.authService.currentUserId)
    .orderBy('createdAt', 'desc')
    .limit(1)).snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as TransactionI;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
    return aTransaction;
  }

  getCurrentlyCreatedBuyTransaction() {
    const aTransaction = this.afStore.collection(`transactions`, ref =>
    ref.where('userUid', '==', this.authService.currentUserId)
    .where('type', '==', 'credit')
    .where('to', '==', this.authService.currentUserId)
    .orderBy('createdAt', 'desc')
    .limit(1)).snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as TransactionI;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
    return aTransaction;
  }

}

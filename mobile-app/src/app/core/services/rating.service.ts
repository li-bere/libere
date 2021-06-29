import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';


// export interface RatingData {
//   shopkeeperID: string;
//   userID: string;
//   userName: string;
//   userDisplayPicture: string;
//   shopID: string;
//   createdAt: string;
//   rateValue: number;
//   comment: string;
// }

@Injectable({
  providedIn: 'root'
})


export class RatingService {

  constructor(private db: AngularFirestore) { }

  getRating(docId) {
    let data = this.db
      .collection(`shop-ratings`)
      .doc(docId)
      .valueChanges();
    return data;
  }

  addRating(data, docId) {
    let RatingRef: AngularFirestoreDocument = this.db.doc(
      `shop-ratings/${docId}`
    );
    return RatingRef.set(data, { merge: true })
  }

  getAllTransactionRatings(id) {
    const transactionRatings = this.db.collection(`shop-ratings`, ref =>
    ref.where('shopID', '==', id)).valueChanges();
    return transactionRatings;
  }

}

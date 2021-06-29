import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";

import { ShopI } from "../../models/shop";

@Injectable({
  providedIn: "root",
})
export class ShopsService {
  constructor(private afStore: AngularFirestore) {}

  getShops() {
    let data = this.afStore.collection("shops").snapshotChanges();

    return data.pipe(
      map((actions) =>
        actions.map((a) => {
          let data = a.payload.doc.data() as ShopI;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  getShop(id: string) {
    return this.afStore.doc<ShopI>(`shops/${id}`).valueChanges();
  }

  updateShop(shopId: string, data) {
    const shopRef = this.afStore.doc<ShopI>(`shops/${shopId}`);
    return shopRef.set(data, { merge: true });
  }
}

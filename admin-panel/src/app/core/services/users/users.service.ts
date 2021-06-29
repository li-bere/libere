import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";

import { AngularFireFunctions } from "@angular/fire/functions";

import { map } from "rxjs/operators";

import { UserI } from "./../../models/user";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  constructor(
    private db: AngularFirestore,
    public functions: AngularFireFunctions
  ) {}

  getUsers() {
    let data = this.db.collection("users").snapshotChanges();
    return data.pipe(
      map((actions) =>
        actions.map((a) => {
          let data = a.payload.doc.data() as UserI;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  getUser(id: string) {
    return this.db.doc(`users/${id}`).valueChanges();
  }

  toggleUserBlockStatus(data) {
    let toggleBlockStatus = this.functions.httpsCallable(
      "toggleUserBlockStatus"
    );
    return toggleBlockStatus(data);
  }

  deleteAuthenticatedUser(data) {
    let deleteFirebaseAuthUser = this.functions.httpsCallable(
      "deleteAuthenticatedUser"
    );
    return deleteFirebaseAuthUser(data);
  }

  deleteUserFromFirestore(userId) {
    const userRef: AngularFirestoreDocument<any> = this.db.doc(
      `users/${userId}`
    );
    return userRef.delete();
  }
}

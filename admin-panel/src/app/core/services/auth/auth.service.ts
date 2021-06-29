import { Injectable } from "@angular/core";

import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";

import * as firebase from "firebase/app";

import { Observable } from "rxjs";
import { take } from "rxjs/operators";

import { UserI } from "../../models/user";

import { CurrentTimeService } from "../current-time/current-time.service";
import { UidService } from "../uid/uid.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  firebaseUser: firebase.User;
  user: Observable<UserI>;

  constructor(
    public afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private currentTimeService: CurrentTimeService,
    private uidService: UidService
  ) {
    this.afAuth.authState.subscribe((firebaseUser: firebase.User) => {
      console.log("Current User", firebaseUser);
      if (firebaseUser) {
        this.firebaseUser = firebaseUser;
        this.user = this.getUser();
      }
    });
  }

  get authenticated(): boolean {
    return this.firebaseUser !== (null || undefined);
  }

  get currentUser(): any {
    return this.authenticated ? this.firebaseUser : null;
  }

  get currentUserObservable(): Observable<firebase.User> {
    return this.afAuth.authState;
  }

  get currentUserId(): string {
    return this.authenticated ? this.firebaseUser.uid : null;
  }

  getUserToken() {
    return firebase.auth().currentUser.getIdTokenResult();
  }

  register(userData): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const deviceId = await this.uidService.getDeviceid();

        const users = await this.afStore
          .collection<UserI>("users", (ref) =>
            ref.where("username", "==", userData.username)
          )
          .valueChanges()
          .pipe(take(1))
          .toPromise();
        if (users && users.length > 0) {
          throw new Error(
            "This username is not available, Kindly try another."
          );
        }

        const currentTime = this.currentTimeService.getCurrentTime();

        await this.afAuth.createUserWithEmailAndPassword(
          userData.email,
          userData.password
        );
        const user: UserI = {
          uid: "",
          email: "",
          username: userData.username,
          name: "",
          age: 6,
          address: "",
          phone: "",
          displayPhoto: null,
          createdAt: currentTime,
          updatedAt: currentTime,
          deviceId,
          roles: {},
        };
        const res = await this.currentUserObservable.pipe(take(1)).toPromise();
        (user.uid = res.uid),
          (user.email = res.email),
          userData.isShopKeeper
            ? (user.roles.shopkeeper = true)
            : (user.roles.user = true);
        await this.updateUser(user);

        await this.sendVerificationEmail();
        return resolve();
      } catch (error) {
        console.error(error);
        return reject(error.message);
      }
    });
  }

  async sendVerificationEmail(showLoader = false): Promise<void> {
    if (!this.authenticated) {
      if (this.firebaseUser.emailVerified) {
        return Promise.reject({ message: "not logged in or verified already" });
      }
    }
    return this.firebaseUser
      .sendEmailVerification()
      .then(() => {
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async emailLogin(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  private async reAuthenticateUser(
    credential: firebase.auth.AuthCredential
  ): Promise<void> {
    try {
      await this.firebaseUser.reauthenticateWithCredential(credential);
      return;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateEmail(email: string, password: string): Promise<void> {
    try {
      const credential = firebase.auth.EmailAuthProvider.credential(
        this.currentUser.email,
        password
      );
      await this.reAuthenticateUser(credential);
      return this.firebaseUser.updateEmail(email);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updatePassword(
    oldPassword: string,
    newpassword: string
  ): Promise<void> {
    try {
      const credential = firebase.auth.EmailAuthProvider.credential(
        this.firebaseUser.email,
        oldPassword
      );
      await this.reAuthenticateUser(credential);
      return this.firebaseUser.updatePassword(newpassword);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async resetPassword(email: string, showLoader = true): Promise<void> {
    return this.afAuth
      .sendPasswordResetEmail(email)
      .then(() => {
      })
      .catch((error) => {
        console.error(error);
      });
  }

  logout(): Promise<void> {
    return this.afAuth.signOut().catch((error) => {
      console.error(error);
    });
  }

  getUser(): Observable<UserI> {
    return this.afStore
      .collection("users")
      .doc<UserI>(this.currentUserId)
      .valueChanges();
  }

  async updateUser(
    user: UserI,
    verifyUsername = false,
    showLoader = false
  ): Promise<void> {
    if (!this.authenticated) {
      return Promise.reject({ message: "Not logged in." });
    }
    if (verifyUsername) {
      const users = await this.afStore
        .collection<UserI>("users", (ref) =>
          ref.where("username", "==", user.username)
        )
        .valueChanges()
        .pipe(take(1))
        .toPromise();
      if (users && users.length > 0 && users[0].uid !== this.currentUserId) {
        return Promise.reject({
          message: "This username is not available, Kindly try another.",
        });
      }
    }

    const userDocumentRef = this.afStore
      .collection("users")
      .doc(this.firebaseUser.uid);
    user.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    return userDocumentRef
      .set(user, { merge: true })
      .then(() => {
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

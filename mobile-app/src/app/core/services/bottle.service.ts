import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { BottleI } from '@app/core/models/bottle';
import { CurrentTimeService } from '@app/core/services/current-time.service';
import { LoadingService } from '@app/core/services/loading.service';
import { AuthService } from '@app/core/services/auth.service';
import { UserService } from '@app/core/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class BottleService {
  constructor(
    private afStore: AngularFirestore,
    private currentTimeService: CurrentTimeService,
    private translate: TranslateService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  async registerBottle(serial) {
    let msg: any;
    let assigned: any;
    this.translate.get('PAGE_CONFIRM_NO_SHOP_EXIST_WITH_ID').subscribe(res => {
      msg=res;
    });
    this.translate.get('PAGE_REGISTER_ERROR_ASSIGNED').subscribe(res => {
      assigned=res;
    });
    try {
      const bottles = await this.afStore
        .collection<BottleI>('bottles', (ref) =>
          ref.where('serial', '==', serial)
        )
        .valueChanges()
        .pipe(take(1))
        .toPromise();
      if (!bottles || bottles.length < 1) {
        return Promise.reject({
          message: msg,
        });
      } else {
        const assignedBottles = await this.afStore
          .collection<BottleI>('bottles', (ref) =>
            ref.where('serial', '==', serial).where('assignee', '==', null)
          )
          .valueChanges()
          .pipe(take(1))
          .toPromise();
        if (!assignedBottles || assignedBottles.length < 1) {
          return Promise.reject({
            message: assigned,
          });
        } else {
          const currentTime = this.currentTimeService.getCurrentTime();
          const user = await this.userService
            .getUser()
            .pipe(take(1))
            .toPromise();
          const data: BottleI = {
            serial,
            updatedAt: currentTime,
            assignee: this.authService.currentUserId,
            assigneeName: user.firstName + ' ' + user.lastName,
            assigneeDisplayPhoto: user.displayPhoto,
            assignedAt: currentTime,
          };

          const bottle = await this.getBottleBySerial(serial)
            .pipe(take(1))
            .toPromise();
          console.log(bottle);

          await this.afStore
            .collection<BottleI>('bottles')
            .doc(bottle[0].id)
            .set(data, { merge: true });
          return;
        }
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getBottles(): Observable<BottleI[]> {
    return this.afStore
      .collection<BottleI>('bottles', (ref) =>
        ref.where('assignee', '==', this.authService.currentUser.uid)
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as BottleI;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  getBottleBySerial(serial: string): Observable<BottleI[]> {
    return this.afStore
      .collection<BottleI>('bottles', (ref) =>
        ref.where('serial', '==', serial)
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as BottleI;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
}

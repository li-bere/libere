import { map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { TicketI, MsgI } from '@app/core/models/ticket';
import { CurrentTimeService } from '@app/core/services/current-time.service';
import { AuthService } from '@app/core/services/auth.service';
import { UserService } from '@app/core/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  constructor(
    private afStore: AngularFirestore,
    private currentTimeService: CurrentTimeService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  async addTicket(data) {
    try {
      const user = await this.userService.getUser().pipe(take(1)).toPromise();
      const currentTime = this.currentTimeService.getCurrentTime();
      const newdata: TicketI = {
        uid: user.uid,
        uType: user.roles.user ? 'user' : 'shopkeeper',
        isOpen: true,
        title: data.title,
        description: data.description,
        createdAt: currentTime,
        updatedAt: currentTime,
      } as TicketI;
      await this.afStore.collection<TicketI>('tickets').add(newdata);
      return;
    } catch (error) {
      throw new Error(error);
    }
  }

  getTicket(id: string) {
    return this.afStore.collection<TicketI>('tickets').doc(id).valueChanges();
  }

  getTickets(isOpen: boolean | null): Observable<TicketI[]> {
    let ticketsRef = this.afStore.collection<TicketI>('tickets', (ref) =>
      ref.where('uid', '==', this.authService.currentUser.uid)
    );
    if (isOpen !== null) {
      ticketsRef = this.afStore.collection<TicketI>('tickets', (ref) =>
        ref
          .where('uid', '==', this.authService.currentUser.uid)
          .where('isOpen', '==', isOpen)
      );
    }
    return ticketsRef.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as TicketI;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  sendMsg(ticketId: string, data: MsgI) {
    const newData: MsgI = {
      ...data
    };
    newData.createdAt = this.currentTimeService.getCurrentTime();
    return this.afStore
      .collection('tickets')
      .doc(ticketId)
      .collection('msgs')
      .add(newData);
  }

  getMsgs(ticketId: string) {
    return this.afStore
      .collection<TicketI>('tickets')
      .doc(ticketId)
      .collection<MsgI>('msgs', (ref) => ref.orderBy('createdAt'))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as MsgI;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
}

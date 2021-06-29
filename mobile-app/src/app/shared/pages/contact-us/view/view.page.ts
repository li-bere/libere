import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TicketI, MsgI } from '@app/core/models/ticket';
import { ToastService } from '@app/core/services/toast.service';
import { AuthService } from '@app/core/services/auth.service';
import { TicketService } from '@app/core/services/ticket.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit, OnDestroy {

  id: string;
  loading = false;
  private pathParamSub: any;

  userId = '';
  msg = '';
  ticket: TicketI;
  msgs: Array<MsgI>;

  constructor(
    private route: ActivatedRoute,
    private toastService: ToastService,
    private authService: AuthService,
    private ticketService: TicketService
  ) { }

  ngOnInit() {
    this.userId = this.authService.currentUserId;
    this.pathParamSub = this.route.params.subscribe(params => {
      this.id = params.id;
      this.getTicket();
   });
  }

  getTicket() {
    this.loading = true;
    this.ticketService.getTicket(this.id).subscribe((ticket: TicketI) => {
      this.ticket = ticket;
      this.getMsgs();
    }, error => {
      this.loading = false;
      console.error(error);
      this.toastService.presentToast(error.message);
    });
  }

  sendMsg() {
    if (this.msg) {
      console.log(this.msg);
      const data: MsgI = {
        msg: this.msg,
        uid: this.authService.currentUserId,
        status: 'sending',
        createdAt: null
      };
      let index = 0;
      if (this.msgs) {
        index = this.msgs.push(data) - 1;
      } else {
        this.msgs = [data];
      }

      this.ticketService.sendMsg(this.id, data).then(() => {
        this.msgs[index].status = 'sent';
      }, () => {
        this.msgs[index].status = 'failed';
      });
    }
  }

  getMsgs() {
    this.loading = true;
    this.ticketService.getMsgs(this.id).subscribe((msgs: Array<MsgI>) => {
      this.msgs = msgs;
      this.loading = false;
    }, error => {
      this.loading = false;
      console.error(error);
      this.toastService.presentToast(error.message);
    });
  }

  ngOnDestroy() {
    this.pathParamSub.unsubscribe();
  }

}

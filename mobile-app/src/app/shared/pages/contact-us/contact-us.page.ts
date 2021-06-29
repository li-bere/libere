import { Component, OnInit } from '@angular/core';

import { TicketI } from '@app/core/models/ticket';
import { ToastService } from '@app/core/services/toast.service';
import { TicketService } from '@app/core/services/ticket.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  loading = false;
  type = 'open';

  openTickets: Array<TicketI>;
  closedTickets: Array<TicketI>;
  allTickets: Array<TicketI>;

  constructor(
    private toastService: ToastService,
    private ticketService: TicketService
  ) { }

  ngOnInit() {
    this.getTickets(true);
  }

  getTickets(isOpen: boolean | null) {
    this.loading = true;
    this.ticketService.getTickets(isOpen).subscribe(tickets => {
      if (isOpen === null) {
        this.allTickets = tickets;
      } else if (isOpen === false) {
        this.closedTickets = tickets;
      } else if (isOpen) {
        this.openTickets = tickets;
      }
      this.loading = false;
    }, error => {
      this.loading = false;
      console.error(error);
      this.toastService.presentToast(error.mesage);
    });
  }

  segmentChanged(event) {
    if (event.detail.value === 'open' && !this.openTickets) {
      this.getTickets(true);
    } else if (event.detail.value === 'closed' && !this.closedTickets) {
      this.getTickets(false);
    } else if (event.detail.value === 'all' && !this.allTickets) {
      this.getTickets(null);
    }
  }

}

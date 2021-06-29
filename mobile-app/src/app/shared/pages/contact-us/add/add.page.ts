import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ToastService } from '@app/core/services/toast.service';
import { TicketService } from '@app/core/services/ticket.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  formValue = {title: '', description: ''};
  form: FormGroup;

  loading = false;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private ticketService: TicketService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(this.formValue.title, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]),
      description: new FormControl(this.formValue.description, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(5000)
      ])
    });
  }

  get title() { return this.form.get('title'); }
  get description() { return this.form.get('description'); }

  async onSubmit() {
    console.log(this.form.value);
    this.loading = true;
    this.ticketService.addTicket(this.form.value)
    .then(() => {
      this.loading = false;
      this.translate.get('PAGE_ADD_MSG_TICKET').subscribe(res => {
        this.toastService.presentToast(res);
        console.log(res);
      });
      // this.toastService.presentToast('Ticket has been added successfully. We will get back to you soon.');
      this.router.navigate(['home']);
    }, error => {
      this.loading = false;
      console.error(error.message);
      this.toastService.presentToast(error.message);
    });
  }

}

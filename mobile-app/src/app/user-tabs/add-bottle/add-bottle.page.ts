import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder } from '@angular/forms';

import { BottleI } from '@app/core/models/bottle';
import { ToastService } from '@app/core/services/toast.service';
import { AlertService } from '@app/core/services/alert.service';
import { BottleService } from '@app/core/services/bottle.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { debounceTime, map, take } from 'rxjs/operators';

@Component({
  selector: 'app-add-bottle',
  templateUrl: './add-bottle.page.html',
  styleUrls: ['./add-bottle.page.scss'],
})
export class AddBottlePage implements OnInit {

  formValue = { serial: '' };
  form: FormGroup;
  loading = false;

  bottles: BottleI[];

  constructor(
    private router: Router,
    private translate: TranslateService,
    private alertService: AlertService,
    private toastService: ToastService,
    private bottleService: BottleService,
    private afs: AngularFirestore,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      serial: ['', [Validators.required], [CustomValidator.serial(this.afs)]]
      // serial: new FormControl(this.formValue.serial, [
      //   Validators.required
      // ], [CustomValidator.serial(this.afs)]),
    });
  }

  get serial() {
    return this.form.get('serial');
  }

  onSubmit() {
    let reg;
    console.log(this.form.value);
    if (this.form.valid) {
      this.loading = true;
      this.bottleService.registerBottle(this.form.value.serial).then(
        () => {
          this.translate.get('PAGE_ADD_BOTTLE_MSG_BOTTLE_REGISTERED').subscribe(res => {
            // this.alertService.success(res);
            reg =res; 
          });
          this.toastService.presentToast(
            reg
          );
          this.loading = false;
          this.router.navigate(['/user-tabs/bottles']);
        },
        (error) => {
          console.error(error);
          this.loading = false;
          this.alertService.errorAlert(error.message);
        }
      );
    }
  }

}

export class CustomValidator {
  static serial(afs: AngularFirestore) {
    return (control: AbstractControl) => {
      const serial = control.value;
      console.log(serial)
      return afs.collection('bottles', ref =>
        ref.where('serial', '==', serial)
      )
      .valueChanges().pipe(
        debounceTime(500),
        take(1),
        map(
          arr => arr.length ?
          (arr[0] as any).assignee ? {serialAvailability: true} : null
          : {serialExistence: true}),
      );
    };
  }

}

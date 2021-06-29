import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: Array<HTMLIonToastElement>=[];
  constructor(
    private toastCtrl: ToastController
  ) {}
  async presentToast(
    message,
    position: 'top'|'bottom'|'middle' = 'bottom',
    options= {duration: 2000},
    onDidDismiss: (res) => any = (res) => {}
  ) {
    const toastsLen = this.toasts.push(await this.toastCtrl.create({
      message,
      position,
      ...options
    }));
    const toast = this.toasts[toastsLen-1];
    toast.present();
    toast.onDidDismiss().then(res => {
      this.toasts.filter(tst => tst === toast);
      onDidDismiss(res);
    });
    return Promise.resolve();
  }
  dismissAllToast() {
    if (this.toasts) {
      this.toasts.forEach(toast => {
        toast.dismiss();
      });
    }
  }
}
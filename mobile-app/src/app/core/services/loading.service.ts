import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loading: HTMLIonLoadingElement;

  constructor(
    public loadingController: LoadingController
  ) { }

  async presentLoading(
    messsage,
    options= {},
    onDidDismiss: (res) => any = (res) => {}
  ) {
    this.loading = await this.loadingController.create({
      message: messsage,
      ...options
    });

    this.loading.onDidDismiss().then((res) => {
      onDidDismiss(res);
    });

    return this.loading.present();
/*     return Promise.resolve(); */
  }

  async dismissLoader() {
    console.log('abc');
    if (this.loading) {
      console.log('xyz');
      return this.loading.dismiss();
    }
    return Promise.resolve();
  }
}

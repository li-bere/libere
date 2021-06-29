import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AppLauncher, AppLauncherOptions } from '@ionic-native/app-launcher/ngx';
import { AlertController } from '@ionic/angular';


import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private subject = new Subject<any>();
  private keepAfterNavigationChange = false;

  constructor(private router: Router, private alertController: AlertController, private appLauncher: AppLauncher) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
         if (this.keepAfterNavigationChange) {
             this.keepAfterNavigationChange = false;
         } else {
             this.subject.next();
         }
      }
    });
  }

  success(message: string, keepAfterNavigationChange = false) {
      this.keepAfterNavigationChange = keepAfterNavigationChange;
      this.subject.next({ type: 'success', text: message });
  }

  error(message: string, keepAfterNavigationChange = false) {
      this.keepAfterNavigationChange = keepAfterNavigationChange;
      this.subject.next({ type: 'error', text: message });
  }

      async errorAlert(res) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: res,
        buttons: [ 'ok']
      });

      await alert.present();
    }

    async mailAlert(res) {
      const alert = await this.alertController.create({
        header: 'Success',
        message: res,
        buttons: [  {
          text: 'CLOSE',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          handler: () => {
           this.email()
          }
        }]
      });

      await alert.present();
    }

    email() {

      //   let email=""
      //   this.platform.ready().then(() => {
      //     window.open('gmail');
      // });
        const options: AppLauncherOptions = {
          packageName: 'com.google.android.gm'
        }
    
        // if(this.platform.is('android')) {
        //   options.uri = 'fb://'
        // } else {
        //   options.packageName = 'com.facebook.katana'
        // }
    
        this.appLauncher.launch(options)
      .then((canLaunch: boolean) =>
                            {console.log('gmail is available');
                            
                            // this.router.navigateByUrl('user-tabs/home');
                                      })
      .catch((error: any) => console.error('gmail is not available'));
      }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

}

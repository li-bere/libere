import { TranslateService } from '@ngx-translate/core';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Plugins, PermissionsOptions, PermissionType } from '@capacitor/core';
import { ToastService } from '@app/core/services/toast.service';
import { AlertService } from '@app/core/services/alert.service';
const { Permissions } = Plugins;

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnDestroy {
  loading = false;
  options: InAppBrowserOptions = {
    location : 'yes',
    hidden : 'no',
    clearcache : 'yes',
    clearsessioncache : 'yes',
    zoom : 'yes',
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'no',
    shouldPauseOnSuspend : 'no',
    closebuttoncaption : 'Close',
    disallowoverscroll : 'no',
    toolbar : 'yes',
    enableViewportScale : 'no',
    allowInlineMediaPlayback : 'no',
    presentationstyle : 'pagesheet',
    fullscreen : 'yes',
};
  constructor(
    private router: Router,
    private translate: TranslateService,
    private barcodeScanner: BarcodeScanner,
    private iab: InAppBrowser,
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    private toastService: ToastService,
    private alertService:AlertService,
  ) {
    
       this.checkGPSPermission();
    
 
  }
  async checkGPSPermission() {
    const options: PermissionsOptions = { name: PermissionType.Camera };
    try {
      const permissionState = await Permissions.query(options);
      console.log(JSON.stringify(permissionState));

      if (permissionState.state !== 'granted') {
        this.askToTurnOnCamera();
        // if (this.platform.is('android')) {
        //   const permissionResponse = await this.androidPermissions.requestPermission(
        //     this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
        //   );
        //   console.log(JSON.stringify(permissionResponse));
        //   if (!permissionResponse.hasPermission) {
        //     throw new Error(
        //       'Application needs camera  for QR access to work properly. Please give the permission so that we can give you better results.'
        //     );
        //   }
        // } else {
        //   throw new Error(
        //     'Application needs camera for QR access to work properly. Please give the permission so that we can give you better results.'
        //   );
        // }
      }
      else{
        this.scanCode();
      }
      
    } catch (error) {
      console.error(error);
      this.toastService.presentToast(error.message);
    }
  }

  async askToTurnOnCamera() {
    // try {
    //   const canRequest = await this.locationAccuracy.canRequest();
    //   if (canRequest) {
    //     const servicesResponse = await this.locationAccuracy.request(
    //       this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY
    //     );
    //     console.log(JSON.stringify(servicesResponse));
    //     if (servicesResponse) {
    //       this.scanCode();
    //     } else {
    //       this.translate.get('COMPONENT_LOCATION_ERROR_MSG_LOCATION_SERVICE').subscribe(res => {
    //         throw new Error(res);
    //       });
    //     }
    //   } else {
    //     this.translate.get('COMPONENT_LOCATION_ERROR_MSG_CHECK_PERMISSION').subscribe(res => {
    //       throw new Error(res);
    //     });
    //   }
    // } catch (error) {
    //   console.error(error);
    //   this.toastService.presentToast(error.message);
    // }
    this.alertService.error("CAMERA PERMISSION NOT GRANTED");
  }



  ionViewDidEnter() {
    // this.scanCode();
  }

  async scanCode() {
    this.loading = true;
    console.log('scan code');
    const scannedCode = await (
      await this.barcodeScanner.scan({
        resultDisplayDuration: 0,
        prompt: '',
        showFlipCameraButton: true,
      })
    ).text;
    console.log(scannedCode);
    if (scannedCode === 'http://li-bere.it/') {
        this.goToWeb(scannedCode);
    } else {
      this.router.navigate(['/user-tabs/transactions/add'], {
        state: { ...JSON.parse(scannedCode) },
      });
    }
    this.loading = false;
  }

  goToWeb(scannedCode) {
    const target = '_blank';
    this.iab.create(scannedCode, target, this.options);
  }

  ngOnDestroy() {
    this.loading = false;
  }
  ionViewDidLoad()
{
 this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
                success => alert('Succes granted the permissions'),
                err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
            );

            this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);

}

           



}

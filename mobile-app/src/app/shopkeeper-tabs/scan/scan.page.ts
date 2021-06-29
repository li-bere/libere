import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

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
    private barcodeScanner: BarcodeScanner,
    private iab: InAppBrowser
  ) {
    this.scanCode();
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
      console.log('this qr code is for transaction');
    }
    this.loading = false;
    /* this.router.navigate(['/user-tabs/transactions/add'], {
      state: { ...JSON.parse(scannedCode) },
    }); */
  }

  goToWeb(scannedCode) {
    const target = '_blank';
    this.iab.create(scannedCode, target, this.options);
  }

  ngOnDestroy() {
    this.loading = false;
  }
}

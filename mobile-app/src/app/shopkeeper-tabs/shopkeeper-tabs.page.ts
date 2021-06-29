import { AfterViewInit, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Plugins } from '@capacitor/core';
const { Keyboard } = Plugins;

import { UserI } from '@app/core/models/user';
import { UserService } from '@app/core/services/user.service';
import introJs from '../../../node_modules/intro.js';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-shopkeeper-tabs',
  templateUrl: './shopkeeper-tabs.page.html',
  styleUrls: ['./shopkeeper-tabs.page.scss'],
})
export class ShopkeeperTabsPage implements OnInit, AfterViewInit, OnDestroy {

  user: UserI;

  showScanButton = true;

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
    private zone: NgZone,
    private router: Router,
    private userService: UserService,
    private storage: Storage,
    private translate: TranslateService,
    private barcodeScanner: BarcodeScanner,
    private iab: InAppBrowser
  ) { }

  ngOnInit() {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });

    Keyboard.addListener('keyboardWillShow', () => {
      console.log('keyboard will show');
      this.zone.run(() => this.showScanButton = false);
    });

    Keyboard.addListener('keyboardWillHide', () => {
      console.log('keyboard will hide');
      this.zone.run(() => this.showScanButton = true);
    });
  }

  gotoScan() {
    this.router.navigate(['shopkeeper-tabs/scan']);
  }

  goToMaps() {
    this.router.navigate(['/shopkeeper-tabs-map']);
  }

  ngOnDestroy() {
    Keyboard.removeAllListeners();
    /* window.removeEventListener('keyboardWillShow', () => {});
    window.removeEventListener('keyboardDidHide', () => {}); */
  }


  ngAfterViewInit() {
    this.storage.get('introShown').then(res => {
      if (!res) {
        this.userService.shopSideIntro();
      }
    });
    
  }

  intro() {
    let next,skip,previous,done;
    let introduction: any;
    let introduction1: any;
    let introduction2: any;
    let introduction3: any;
    let introduction4: any;
    this.translate.get('TUTORIAL_INTRO').subscribe(res => {
      console.log(res);
       introduction= res;
      
    });
    this.translate.get('TUTORIAL_INTRO1').subscribe(res => {
      console.log(res);
       introduction1= res;
      
    });
    this.translate.get('TUTORIAL_INTRO2').subscribe(res => {
      console.log(res);
       introduction2= res;
      
    });
    this.translate.get('TUTORIAL_INTRO3').subscribe(res => {
      console.log(res);
       introduction3= res;
      
    });
    this.translate.get('TUTORIAL_INTRO4').subscribe(res => {
      console.log(res);
       introduction4= res;
      
    });
    this.translate.get('NEXT').subscribe(res => {
      console.log(res);
       next= res;
      
    });
    this.translate.get('SKIP').subscribe(res => {
      console.log(res);
       skip= res;
      
    });
    this.translate.get('PREVIOUS').subscribe(res => {
      console.log(res);
       previous= res;
      
    });
    this.translate.get('DONE').subscribe(res => {
      console.log(res);
       done= res;
      
    });
    

    let intro = introJs.introJs();
    this.storage.set('introShown', true);
    // Initialize steps
    intro.setOptions({
      steps: [
        {
          
          intro: introduction,
        },
        {
          element: document.querySelector('.transactions'),
          intro: introduction1,
          position: 'bottom',
        },
        {
          element: document.querySelector('#maps-page'),
          intro: introduction2,
          position: 'bottom',
        },
        {
          element: document.querySelector('.gotoScan'),
          intro:
          introduction3,
          position: 'bottom',
        },
        {
          element: document.querySelector('.profile'),
          intro: introduction4,
          position: 'bottom',
        },
      ],
      showProgress: true,
      overlayOpacity: '0.8',
      exitOnOverlayClick: false,
      nextLabel: next,
      skipLabel: skip,
      prevLabel: previous,
      doneLabel: done
    });
    intro.start();
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

}

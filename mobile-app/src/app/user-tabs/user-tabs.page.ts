import { AlertService } from './../core/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { Plugins } from '@capacitor/core';
const { Keyboard } = Plugins;

import { UserI } from '@app/core/models/user';
import { UserService } from '@app/core/services/user.service';
import introJs from '../../../node_modules/intro.js';
import { Storage } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { AuthService } from '@app/core/services/auth.service.js';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { JoyrideOptions } from 'ngx-joyride/lib/models/joyride-options.class';
import { JoyrideService } from 'ngx-joyride';

@Component({
  selector: 'app-user-tabs',
  templateUrl: './user-tabs.page.html',
  styleUrls: ['./user-tabs.page.scss'],
})
export class UserTabsPage implements OnInit, AfterViewInit {
  user: UserI;

  showScanButton = true;
  emailVerified: boolean

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
    private androidPermissions: AndroidPermissions,
    private iab: InAppBrowser,
    private authService: AuthService,
    private AlertService: AlertService,
    public afAuth: AngularFireAuth,
    private joyrideService: JoyrideService
  ) {}
   goToMaps() {
    this.authService.currentUserObservable.subscribe(async user => {
      await user.reload();
      if (user.emailVerified) {
        this.router.navigate(['/user-tabs-map']);
      } else {
        this.router.navigate(['/non-verified']);
      }
    })
    
  }

  async check() {
    
    this.authService.currentUserObservable.subscribe(async user => {
      await user.reload();
      console.log(user.emailVerified);
      if (user.emailVerified) {
      
        this.router.navigate(['/user-tabs/transactions']);
      } else {
       await user.reload()
      
        this.router.navigate(['/non-verified']);
       
        
      }
    })
  }

  ngOnInit() {
    // this.authService.currentUserObservable.subscribe((user) => {
    //   user.reload();
    //   console.log(user)
    //   if(user.emailVerified) {

    //     this.emailVerified = true;
    //   } else {
    //     this.emailVerified = false;
    //   }
    // })
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });

    Keyboard.addListener('keyboardWillShow', () => {
      console.log('keyboard will show');
      this.zone.run(() => (this.showScanButton = false));
    });

    Keyboard.addListener('keyboardWillHide', () => {
      console.log('keyboard will hide');
      this.zone.run(() => (this.showScanButton = true));
    });
  }

  gotoScan() {
    this.router.navigate(['user-tabs/scan']);
  }

  ngAfterViewInit() {
    this.storage.get('introShown').then(res => {
      if (!res) {
        this.userService.userSideIntro();
      }
    });

    

  }

  // intro() {
  //   let next, skip, previous, done;
  //   let introduction: any;
  //   let introduction1: any;
  //   let introduction2: any;
  //   let introduction3: any;
  //   let introduction4: any;
  //   this.translate.get('TUTORIAL_INTRO').subscribe(res => {
  //     console.log(res);
  //     introduction = res;

  //   });
  //   this.translate.get('TUTORIAL_INTRO1').subscribe(res => {
  //     console.log(res);
  //     introduction1 = res;

  //   });
  //   this.translate.get('TUTORIAL_INTRO2').subscribe(res => {
  //     console.log(res);
  //     introduction2 = res;

  //   });
  //   this.translate.get('TUTORIAL_INTRO3').subscribe(res => {
  //     console.log(res);
  //     introduction3 = res;

  //   });
  //   this.translate.get('TUTORIAL_INTRO4').subscribe(res => {
  //     console.log(res);
  //     introduction4 = res;

  //   });
  //   this.translate.get('NEXT').subscribe(res => {
  //     console.log(res);
  //     next = res;

  //   });
  //   this.translate.get('SKIP').subscribe(res => {
  //     console.log(res);
  //     skip = res;

  //   });
  //   this.translate.get('PREVIOUS').subscribe(res => {
  //     console.log(res);
  //     previous = res;

  //   });
  //   this.translate.get('DONE').subscribe(res => {
  //     console.log(res);
  //     done = res;

  //   });

  //   const intro = introJs.introJs();
  //   this.storage.set('introShown', true);
  //   // Initialize steps
  //   intro.setOptions({

  //     steps: [
  //       {
  //         intro: introduction,

  //       },
  //       {
  //         element: document.querySelector('.transactions'),
  //         intro: introduction1,
  //         position: 'bottom',
  //       },
  //       {
  //         element: document.querySelector('#maps-page'),
  //         intro: introduction2,
  //         position: 'bottom',
  //       },
  //       {
  //         element: document.querySelector('.gotoScan'),
  //         intro:
  //         introduction3,
  //         position: 'bottom',
  //       },
  //       {
  //         element: document.querySelector('.profile'),
  //         intro: introduction4,
  //         position: 'bottom',
  //       },
  //     ],
  //     showProgress: true,
  //     overlayOpacity: '0.8',
  //     exitOnOverlayClick: false,
  //     nextLabel: next,
  //     skipLabel: skip,
  //     prevLabel: previous,
  //     doneLabel: done
  //   });

  //   intro.start();

  // }


  async scanCode() {
    this.loading = true;
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      async result => {
        console.log('Has permission?',result.hasPermission);
        console.log('scan code');
        if(result.hasPermission){
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
            else{
              this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
            
            }
        }
      ,
      err => 
      this.AlertService.errorAlert("give permission for camera first from phone setting")
    );
  }

  goToWeb(scannedCode) {
    const target = '_blank';
    this.iab.create(scannedCode, target, this.options);
  }




}

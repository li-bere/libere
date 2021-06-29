import { DirectionsService } from '@app/core/services/directions.service';
import { TransactionService } from '@app/core/services/transaction.service';
import { ShopI } from './../../../core/models/shop';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from './../../../core/services/toast.service';
import { ShopService } from './../../../core/services/shop.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { Plugins, PermissionsOptions, PermissionType } from '@capacitor/core';
const { Permissions, Geolocation, Browser } = Plugins;

import { TransactionTypes } from '@app/core/constants/transaction-type';

import { ConfirmPage } from '../confirm/confirm.page';

// import { TransactionDetailsPage } from '@app/shared/pages/transaction-details/transaction-details.page';
// import { ShopI } from '@app/core/models/shop';
import { AngularFirestore } from '@angular/fire/firestore';
import { debounceTime, map, take } from 'rxjs/operators';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { TransactionI } from '@app/core/models/transaction';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { request } from 'http';
import { AlertService } from '@app/core/services/alert.service';


@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  formValue = { shopSid: '' };
  form: FormGroup;
  shop: any;
  coordinates;
  allShops=[];
  shopId: any;
  items=[];
  isItemAvailable = false;
  isShopSidSelected: boolean = false;
  itemValues: any;
  btnRefillDisabled = false;
  btnBuyDisabled = false;
  initializeItems(){
    this.items = this.allShops;
}

getItems(ev: any) {
    // Reset items back to all of the items
    console.log(ev);
    if (ev.detail.value === '') {
      this.isShopSidSelected = false;
      this.initializeItems();
    }
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() !== '') {
        this.isItemAvailable = true;
        this.items = this.items.filter((item) => {
            return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
    } else {
        this.isItemAvailable = false;
    }
}
  // public search = "";
  // public params = {
  //   hl: "en",
  //   ds: "yt",
  //   xhr: "t",
  //   client: "youtube",
  // };
  transactions: Array<TransactionI>;
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
    public modalCtrl: ModalController,
    private shopService: ShopService,
    private toastService: ToastService,
    private DirectionsService: DirectionsService,
    private afs: AngularFirestore,
    private barcodeScanner: BarcodeScanner,
    private transactionService: TransactionService,
    private iab: InAppBrowser,
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private alertService: AlertService,
  ) { }


  async ngOnInit() {
 
    // await this.checkGPSPermission();
    this.transactionService.getLastTransactions().subscribe((res: Array<TransactionI>)=>{
      console.log(res);
      this.transactions=res;
      
       }   )
    console.log(this.router.getCurrentNavigation().extras.state);
    this.form = new FormGroup({
      shopSid: new FormControl(this.formValue.shopSid, [
        Validators.required
      ], 
      [CustomValidator.shop(this.afs)]
      ),
    });
    const state = this.router.getCurrentNavigation().extras.state;
    if (state) {

      this.shopSid.setValue(state.shopSid);
    }
    this.shops();
    console.log(this.allShops,"all is well");
  }
  async ngAfterViewInit() {
    
    console.log('view enter');
    if (this.platform.is('cordova')) {
      await this.checkGPSPermission();
    } else {
      await this.getlocation();
    }
   
  }
  
  async checkGPSPermission() {
    const options: PermissionsOptions = { name: PermissionType.Geolocation };
    try {
      console.log('check permission started');
      const permissionState = await Permissions.query(options);
      console.log(JSON.stringify(permissionState));

      if (permissionState.state !== 'granted') {
        if (this.platform.is('android')) {
          const permissionResponse = await this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
          );
          console.log(JSON.stringify(permissionResponse));
          if (!permissionResponse.hasPermission) {
            throw new Error(
              'Application needs permisison for location access to work properly. Please give the permission so that we can give you better results.'
            );
          }
        } else {
          throw new Error(
            'Application needs permisison for location access to work properly. Please give the permission so that we can give you better results.'
          );
        }
      }
      this.askToTurnOnGPS();
    } catch (error) {
      console.error(error);
      this.toastService.presentToast(error.message);
    }
  }

  async askToTurnOnGPS() {
    try {
      console.log('GPS TURN ON FUNCTION CALLED');
      const canRequest = await this.locationAccuracy.canRequest();
      if (canRequest) {
        const servicesResponse = await this.locationAccuracy.request(
          this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY
        );
        console.log(JSON.stringify(servicesResponse));
        if (servicesResponse) {
          console.log('service response is', servicesResponse);
          await this.getlocation();
        } else {
          throw new Error('Could not start location services.');
        }
      } else {
        throw new Error(
          'Application needs permisison for location access to work properly. Please give the permission so that we can give you better results.'
        );
      }
    } catch (error) {
      console.error(error);
      this.toastService.presentToast(error.message);
    }
  }


  // async askToTurnOnGPS() {
  //   try {
  //     const canRequest = await this.locationAccuracy.canRequest();
  //     if (canRequest) {
  //       const servicesResponse = await this.locationAccuracy.request(
  //         this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY
  //       );
  //       console.log(JSON.stringify(servicesResponse));
  //       if (servicesResponse) {
  //         this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.LocationAccuracy).then(
  //           async result => {
  //             console.log('Has permission?',result.hasPermission);
  //             console.log('scan code');
  //             if(result.hasPermission){
  //               await this.getlocation();
  //             }
  //             else{
  //               this.alertService.errorAlert("give permission for location first from phone setting")
  //             }
  //           });
        
  //       } else {
  //         throw new Error('Could not start location services.');
  //       }
  //     } else {
  //       throw new Error(
  //         'Application needs permisison for location access to work properly. Please give the permission so that we can give you better results.'
  //       );
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     this.toastService.presentToast(error.message);
  //   }
  // }
   shops(){
    console.log("in shops");
    const x= this.afs
    .collection<ShopI>('shops')
    .valueChanges();
    x.subscribe( res=>{
      console.log(res);
      for(let i=0;i<res.length;i++){
        // if(res[i].isFountain){
          this.allShops.push(res[i].sid);
        // }
         
      }

      
    });
    console.log(this.allShops);
  }
  
 
  // handleResultSelected(result) {
  //   this.search = result;
  // }


  get shopSid() {
    return this.form.get('shopSid');
  }

  async onSubmit() {
    console.log(this.shopSid);
    // await this.checkGPSPermission();
     if (this.form.valid) {
      const modal = await this.modalCtrl.create({
        component: ConfirmPage,
        cssClass: 'overlay-modal',
        backdropDismiss: true,
        componentProps: {
          shopSid: this.form.value.shopSid,
          type: TransactionTypes.REFILL,
          coordinates: this.coordinates
        },
      });

      modal.onDidDismiss().then((data) => {
        if (data.data && data.data.status === 1) {
          this.router.navigate(['/user-tabs/transactions']);
          console.log(data);
        }
      });
      return await modal.present();

    } 

  }
  async getlocation(){
    
    try{
      this.loading=true;
      this.btnBuyDisabled=true;
      this.btnRefillDisabled=true;
      this.coordinates = await Geolocation.getCurrentPosition();
    console.log('the coordinates are ',this.coordinates);
    this.btnBuyDisabled=false;
      this.btnRefillDisabled=false;
    this.loading=false;
    } catch (error) {
        this.loading=false;
        console.error(error);
        this.toastService.presentToast(error.message);
        
        }
    
  }
   async buy() {
    // let check: any;
    console.log(this.form.value);
    // await this.checkGPSPermission();
    // let shop=this.form.value;
    if (this.form.valid) {
      if (this.form.valid) {
        const modal = await this.modalCtrl.create({
          component: ConfirmPage,
          cssClass: 'overlay-modal',
          backdropDismiss: true,
          componentProps: {
            shopSid: this.form.value.shopSid,
            type: TransactionTypes.BUY,
            coordinates: this.coordinates
          },
        });
  
        modal.onDidDismiss().then((data) => {
          if (data.data && data.data.status === 1) {
            this.router.navigate(['/user-tabs/transactions']);
            console.log(data);
          }
        });
        return await modal.present();
  
      } 
  
      // this.shopService.getShopBySid(shop.shopSid.toLowerCase()).subscribe(
      //   (async res => {
      //     console.log(res);
      //     console.log(res[0].credit);
          // if(res[0].credit>9){
            
              // const modal = await this.modalCtrl.create({
              //   component: ConfirmPage,
              //   cssClass: 'overlay-modal',
              //   backdropDismiss: true,
              //   componentProps: {
              //     shopSid: this.form.value.shopSid,
              //     type: TransactionTypes.BUY
              //   },
              // });
        
              // modal.onDidDismiss().then((data) => {
              //   console.log(data);
              //   if (data.data && data.data.status === 1) {
              //     this.router.navigate(['/user-tabs/transactions']);
              //   }
              // });
              // return await modal.present();
              
              // this.router.navigate(['/confirm-transaction'], { queryParams: {
              //   id: this.form.value.shopSid,
              //   type: TransactionTypes.BUY
              // } });
      //     }
      //     else{
      //       this.translate.get('SHOP_NO_CREDIT').subscribe(res => {
      //         this.toastService.presentToast(res);
      //       });
      //     }
      // }));
    }
  }


  setvalue(value){
    console.log(value);
    console.log(this.itemValues);
    if (!value) {
      this.isShopSidSelected = false;
    } else {
      this.shopSid.setValue(value);
      this.isShopSidSelected = true;
    } 
     
      

    
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
    console.log(scannedCode)
    
    if (scannedCode === 'http://li-bere.it/') {
        this.goToWeb(scannedCode);
    } else {
      this.router.navigate(['/user-tabs/transactions/add']);
      console.log(JSON.parse(scannedCode));
      let setToshopSid = JSON.parse(scannedCode);
      this.shopSid.setValue(setToshopSid.shopSid);
    }
    this.loading = false;
  }

  goToWeb(scannedCode) {
    const target = '_blank';
    this.iab.create(scannedCode, target, this.options);
  }
  getDirections(shopId) {
    this.DirectionsService.getDirections(shopId);
  }
 gotoShopkeeperProfile(shopId) {
    console.log(shopId);
    this.router.navigate(['./view-shop'], { queryParams: { id: shopId } });
  }


}

export class CustomValidator {
  static shop(afs: AngularFirestore) {
    return (control: AbstractControl) => {
      const shopSid = control.value.toLowerCase();
      return afs.collection<ShopI>('shops', ref =>
      ref.where('sid', '==', shopSid))
      .valueChanges().pipe(
        debounceTime(500),
        take(1),
        map(arr => {
          if(!arr.length) {
            return {shopExistence: true}
          } else if (!arr[0].isFountain) {
            return {isFountain: true}
          } else {
            return null;
          }
          //!arr.length ? {shopExistence: false} : null , (arr => !arr[0].isFountain ? {isFountain: false} : null )
        })
      )
    }
  }
}


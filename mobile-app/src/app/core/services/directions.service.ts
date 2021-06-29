import { ShopI } from './../models/shop';
import { Injectable } from '@angular/core';

import { AngularFireFunctions } from '@angular/fire/functions';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { Platform } from '@ionic/angular';
// import { Browser } from 'protractor';
import { LatLngI } from '../models/address';
import { Plugins } from '@capacitor/core';
import { ShopService } from './shop.service';
import { google } from '@google/maps';

declare var google;
const { Browser,Geolocation } = Plugins;
@Injectable({
  providedIn: 'root'
})
export class DirectionsService {
  currentLocation = new google.maps.LatLng(0, 0);
  shop: any;
  constructor(
    public functions: AngularFireFunctions,
    private platform: Platform,
    private shopService: ShopService,
    private launchNavigator: LaunchNavigator
  ) { }

  getDistance(origin, destination) {
    const callable = this.functions.httpsCallable('getDistance');
    return callable({ origin, destination });
  }
  getDirections(shopId){
    console.log(shopId);
    this.shopService.getShop(shopId).subscribe(res => {
      this.shop = res;
      console.log(this.shop.address.latLng);
      this.navigateToMap(this.shop.address.latLng);

    })
  }

  async navigateToMap(latLng: LatLngI) {
    const coordinates = await Geolocation.getCurrentPosition();
     this.currentLocation = {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude,
      };
    console.log(this.currentLocation);
    const app = this.platform.is('ios')
      ? this.launchNavigator.APP.APPLE_MAPS
      : this.launchNavigator.APP.GOOGLE_MAPS;
    let isAvailable = false;
    try {
      isAvailable = await this.launchNavigator.isAppAvailable(app);
    } catch (error) {
      console.error(error);
    }
    console.log(isAvailable);
    if (isAvailable) {
      const options: LaunchNavigatorOptions = {
        start: [this.currentLocation.lat, this.currentLocation.lng],
        app,
      };
      await this.launchNavigator.navigate([latLng.lat, latLng.lng], options);
    } else {
      await Browser.open({
        url:
          'https://www.google.com/maps/dir/?api=1&destination=' +
          latLng.lat +
          ',' +
          latLng.lng +
          '&travelmode=driving',
      });
    }
  }

}

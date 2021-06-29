import { TranslateService } from '@ngx-translate/core';
import {
  OnInit,
  Component,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavController, ModalController, Platform } from '@ionic/angular';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import {
  Plugins,
  PermissionsOptions,
  PermissionType
} from '@capacitor/core';
const { Permissions, Geolocation } = Plugins;

import { AddressI } from '@app/core/models/address';
import { ToastService } from '@app/core/services/toast.service';

import { GoogleMapPage } from '@app/shared/pages/google-map/google-map.page';

declare var google;

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements AfterViewInit {
  @Input() form: FormGroup;
  @Input() address: AddressI;
  @Output() willAddressChanged: EventEmitter<any> = new EventEmitter();
  @Output() didAddressChanged: EventEmitter<any> = new EventEmitter();

  @ViewChild('map') mapElement: ElementRef;

  map: google.maps.Map;
  loading = false;

  constructor(
    private platform: Platform,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  ngAfterViewInit() {
    this.patchAddress(this.address);
  }

  get location() {
    return this.form.get('address').get('location');
  }
  get city() {
    return this.form.get('address').get('city');
  }
  get state() {
    return this.form.get('address').get('state');
  }
  get zip() {
    return this.form.get('address').get('zip');
  }

  patchAddress(address) {
    address.zip = address.zip.toString().padStart(5, '0');
    this.form.patchValue({ address });
    this.initializeMap();
  }

  async initializeMap() {
    if (this.platform.is('cordova')) {
      await this.checkGPSPermission();
    } else {
      this.loadMap();
    }
  }

  async checkGPSPermission() {
    const options: PermissionsOptions = { name: PermissionType.Geolocation };
    try {
      const permissionState = await Permissions.query(options);
      console.log(JSON.stringify(permissionState));

      if (permissionState.state !== 'granted') {
        if (this.platform.is('android')){
          const permissionResponse = await this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
          );
          console.log(JSON.stringify(permissionResponse));
          if (!permissionResponse.hasPermission) {
            this.translate.get('COMPONENT_LOCATION_ERROR_MSG_CHECK_PERMISSION').subscribe(res => {
              throw new Error(res);
            });
          }
        } else {
          this.translate.get('COMPONENT_LOCATION_ERROR_MSG_CHECK_PERMISSION').subscribe(res => {
            throw new Error(res);
          });
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
      const canRequest = await this.locationAccuracy.canRequest();
      if (canRequest) {
        const servicesResponse = await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
        console.log(JSON.stringify(servicesResponse));
        if (servicesResponse){
          this.loadMap();
        } else {
          this.translate.get('COMPONENT_LOCATION_ERROR_MSG_LOCATION_SERVICE').subscribe(res => {
            throw new Error(res);
          });

        }
      } else {
        this.translate.get('COMPONENT_LOCATION_ERROR_MSG_CHECK_PERMISSION').subscribe(res => {
          throw new Error(res);
        });
      }
    } catch (error) {
      console.error(error);
      this.toastService.presentToast(error.message);
    }
  }

  async loadMap() {
    this.loading = true;
    if (
      !this.address.latLng ||
      (this.address.latLng.lat === 0 && this.address.latLng.lng === 0)
    ) {
      const coordinates = await Geolocation.getCurrentPosition();
      console.log('Current', coordinates);
      this.address = {
        ...this.address,
        latLng: {
          lat: coordinates.coords.latitude,
          lng: coordinates.coords.longitude,
        },
      };
    }

    console.log('latLng', this.address.latLng);
    const latLng = new google.maps.LatLng(
      this.address.latLng.lat,
      this.address.latLng.lng
    );
    console.log('latLng', latLng);

    const mapOptions = {
      center: latLng,
      zoom: 15,
      disableDefaultUI: true,
      gestureHandling: 'none',
      keyboardShortcuts: false,
      scaleControl: false,
      scrollwheel: false,
      navigationControl: false,
      clickableIcons: false,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    console.log(this.map);

    const marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      draggable: false,
    });

    this.map.setCenter(latLng);

    const self = this;
    this.map.addListener('tilesloaded', () => {
      console.log('map loaded');
      self.loading = false;
    });
  }

  async navigateToMap() {
    this.willAddressChanged.emit();
    const googleMapModal = await this.modalCtrl.create({
      component: GoogleMapPage,
      componentProps: {
        lat: this.address.latLng.lat,
        lng: this.address.latLng.lng,
      },
    });

    googleMapModal.onDidDismiss().then((address) => {
      console.log('address', JSON.stringify(address));
      if (!address.data) {
        this.didAddressChanged.emit(this.address);
        this.loading = false;
        return;
      }
      this.address = address.data;
      this.patchAddress(this.address);
      this.didAddressChanged.emit(this.address);
      this.loading = false;
    });

    googleMapModal.onWillDismiss().then(() => {
      this.loading = true;
    });

    return await googleMapModal.present();
  }








  



}

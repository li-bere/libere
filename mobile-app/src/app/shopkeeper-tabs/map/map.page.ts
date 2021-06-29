import { TranslateService } from '@ngx-translate/core';
import {
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
  OnInit,
  AfterViewInit,
  NgZone,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';

import {
  LaunchNavigator,
  LaunchNavigatorOptions,
} from '@ionic-native/launch-navigator/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Plugins, PermissionsOptions, PermissionType } from '@capacitor/core';
const { Permissions, Geolocation, Browser } = Plugins;

import { take, map } from 'rxjs/operators';

import { LatLngI } from '@app/core/models/address';
import { ShopI } from '@app/core/models/shop';
import { FountainI } from '@app/core/models/fountain';
import { ToastService } from '@app/core/services/toast.service';
import { DirectionsService } from '@app/core/services/directions.service';
import { ShopService } from '@app/core/services/shop.service';
import { FountainService } from '@app/core/services/fountain.service';
import MarkerClusterer from '@googlemaps/markerclustererplus';

declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  geoCoder: any;
  mapBounds = new google.maps.LatLngBounds();
  currentLocation = new google.maps.LatLng(0, 0);

  shopIdToOpen: string;
  fountainIdToOpen: string;

  public activeWindow: any;

  fountains: Array<any> = [];
  paramsSub: any;
  shopsSubscription: any;
  fountainsSubscription: any;
  shopMarkers: any;
  autoCompleteService: any;
  autoCompleteOptions: google.maps.places.AutocompletionRequest;
  autoCompleteRestrictions: google.maps.places.ComponentRestrictions;
  autoCompleteItems: any;
  currentLocationMarker: any;
  disableLocationSavebtn = true;
  loading = false;

  constructor(
    private platform: Platform,
    private router: Router,
    private route: ActivatedRoute,
    private launchNavigator: LaunchNavigator,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private toastService: ToastService,
    private directionsService: DirectionsService,
    private fountainService: FountainService,
    private shopService: ShopService,
    private zone: NgZone,
    private translate: TranslateService
  ) {
    this.geoCoder = new google.maps.Geocoder();
    // Initialize Auto complete options
    this.autoCompleteService = new google.maps.places.AutocompleteService();
    this.autoCompleteRestrictions = {
      country: 'it'
    };
    this.autoCompleteOptions = {
      input: '',
      types: ['geocode'],
      componentRestrictions: this.autoCompleteRestrictions
    };
    this.autoCompleteItems = [];
  }

  ngOnInit() {
    const state = this.route.paramMap.pipe(map(() => window.history.state));
    this.paramsSub = state.subscribe((stateData) => {
      this.shopIdToOpen = stateData.shopId;
      this.fountainIdToOpen = stateData.fountainId;
    });
  }

  async ngAfterViewInit() {
    this.loading = true;
    console.log('view enter');
    await this.initializeMap();
  }

  /* async ionViewDidEnter() {
    console.log('view enter');
    await this.initializeMap();
  } */

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
      const canRequest = await this.locationAccuracy.canRequest();
      if (canRequest) {
        const servicesResponse = await this.locationAccuracy.request(
          this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY
        );
        console.log(JSON.stringify(servicesResponse));
        if (servicesResponse) {
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
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.createMap(coordinates.coords.latitude, coordinates.coords.longitude);
      this.currentLocation = {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude,
      };
      return;
    } catch (error) {
      this.toastService.presentToast(error.message);
    }
  }

  createMap(lat, lng) {
    const myMapOptions = { clickableIcons: false };
    const latLng = new google.maps.LatLng(lat, lng);
    const mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeControlOptions: {
        
        mapTypeIds: []
      },
      styles: [
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        }
      ],
      draggable: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      // scaleControl: false,
      enableHighAccuracy: true,
      streetViewControl: false,
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.currentLocationMarker = new google.maps.Marker({
      position: this.map.getCenter(),
      map: this.map,
      animation: google.maps.Animation.DROP,
      draggable: true,
      enableHighAccuracy: true,
      icon: '/assets/img/icon/marker-blue.png',
    });

    /* function createDummyDiv(w, h) {
      const dummydiv = document.createElement('div');
      dummydiv.className = 'dummy-div';
      dummydiv.style.width = w;
      dummydiv.style.height = h;
      return dummydiv;
    }
    this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(
      createDummyDiv('100%', '56px')
    );
    this.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(
      createDummyDiv('100%', '56px')
    ); */

    // this.map.setPadding(100, 100, 100, 100);
    // this.mapBounds.extend(latLng);
    // this.map.fitBounds(this.mapBounds, { top: 100, bottom: 100 });
    this.addYourLocationButton();
    this.loadShops();
    this.markNearbyFountains(lat, lng);

    this.currentLocationMarker.addListener('dragend', () => {
      const markerLat = this.map.center.lat();
      const markerLng = this.map.center.lng();
      console.log(markerLat, markerLng);
      this.locationRefreshed(this.currentLocationMarker.position);
    });

    this.map.addListener('dragend', () => {
      this.loading = true;
      const dragLat = this.map.center.lat();
      const dragLng = this.map.center.lng();
      console.log(dragLat, dragLng);
      if (dragLat !== null && dragLng !== null) {
        this.markNearbyFountains(dragLat, dragLng);
      }
    });
     this.map.addListener('zoom_changed', () => {
      this.loading = true;
      const currentZoomLevel = this.map.getZoom();
        console.log(currentZoomLevel);
        const radius = (23 - currentZoomLevel) * 10;
        console.log(radius);
        const mapCenter = this.map.getCenter();

     
        this.markzoomedFountains(mapCenter.lat(), mapCenter.lng(),radius);
      
      
    });

    // const self = this;
    // this.map.addListener('idle', () => {
    //   console.log('map loaded');
    //   this.map.setPadding( 100, 100, 100, 100 );
    // });
    // this.loadFountains();
  }

  updateSearchResults() {
    if (this.autoCompleteOptions.input === '') {
      this.autoCompleteItems = [];
      return;
    }
    this.autoCompleteService.getPlacePredictions(
      this.autoCompleteOptions,
      predictions => {
        this.autoCompleteItems = [];
        if (predictions) {
          console.log('place predictions', predictions);
          this.zone.run(() => {
            predictions.forEach(prediction => {
              this.autoCompleteItems.push(prediction);
            });
          });
        }
      }
    );
  }

  placeMarker(location: google.maps.LatLng) {
    this.currentLocationMarker.setPosition(location);
    this.map.panTo(location);
    // this.locationRefreshed(location);
  }



  selectSearchResult(item) {
    this.autoCompleteOptions.input = item.description;
    this.autoCompleteItems = [];
    console.log('place id', item.place_id);
    this.geoCoder.geocode({ placeId: item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        console.log('result', results);
        console.log('status', status);
        this.markNearbyFountains(results[0].geometry.location.lat(),results[0].geometry.location.lng())
        this.placeMarker(results[0].geometry.location);
      } else {
        results[0];
        console.log('result', results);
        console.log('status', status);
        // this.alertService.error("An Error Ocurred Please Try Again");
      }
    }),
      error => {
        console.log(error);
      };
  }

  locationRefreshed(position: google.maps.LatLng) {

    this.reverseGeoCode(position).then(addressObj => {
      console.log(addressObj);
      this.autoCompleteOptions.input = addressObj.formatted_address;
      console.log(
        this.extractFromAddress(addressObj.address_components, 'country', true)
      );
      const country = this.extractFromAddress(
        addressObj.address_components,
        'country',
        true
      );
      if (
        country.toUpperCase() === 'it'.toUpperCase() ||
        country.toUpperCase() === 'italy'.toUpperCase()
      ) {
        this.disableLocationSavebtn = false;
      } else {
        this.translate.get('PAGE_GOOGLE_MAPS_ERROR_LOCATION').subscribe(res => {
          this.toastService.presentToast(res);
        });
        // this.toastService.presentToast(
        //   'This app is only for those who are located in Italy.'
        // );
      }
    });
  }

  reverseGeoCode(latlng: google.maps.LatLng) {
    return new Promise<any>((resolve, reject) => {
      this.geoCoder.geocode({ location: latlng }, function(results, status) {
        if (status === 'OK') {
          if (results[0]) {
            console.log(results[0]);
            resolve(results[0]);
          } else {
            reject();
          }
        } else {
          reject();
        }
      });
    });
  }

  extractFromAddress(components, type, short = false) {
    return (
      components
        .filter(component => component.types.indexOf(type) === 0)
        .map(item => (short ? item.short_name : item.long_name))
        .pop() || null
    );
  }

  loadShops() {
    this.shopsSubscription = this.shopService
      .getAllShops()
      .subscribe((shops: Array<ShopI>) => {
        this.addShopMarkers(shops);
      });
  }

  addShopMarkers(shops: Array<ShopI>) {
    this.shopMarkers = [];
    const promise = new Promise((resolve, reject) => {
      shops.forEach(async (shop, index, shopsArray) => {
        const icon = shop.isFountain
          ? '/assets/img/icon/marker-li-point.png'
          : '/assets/img/icon/marker-reseller.png';
        const latLng = new google.maps.LatLng(
          shop.address.latLng.lat,
          shop.address.latLng.lng
        );
        const marker = new google.maps.Marker({
          position: latLng,
          // map: this.map,
          // animation: google.maps.Animation.DROP,
          draggable: false,
          icon,
        });
        let distance = 'Unknown';
        
        try {
          const distanceRes = await this.directionsService
            .getDistance(this.currentLocation, shop.address.latLng)
            .pipe(take(1))
            .toPromise();
          distance = distanceRes.rows[0].elements[0].distance.text;
          if (!distance) {
            distance = 'Unknown';
          }
        } catch (error) {
          console.error(error);
        }
        let trans: any;
        this.translate.get('PAGE_MAP_GET_DIRECTIONS').subscribe(res => {
         trans=res;
        });
        const name = shop.shopkeeperName ? shop.shopkeeperName : 'Name';
        const content = `
          <ion-item class="ion-no-border" style="--border-color: transparent;">
            <ion-avatar slot="start">
              <img src="${shop.shopkeeperDisplayPhoto}">
            </ion-avatar>
            <ion-label class="ion-no-margin">
              <h3>${shop.name}</h3>
              <p class="ion-text-capitalize">${name}</p>
              <p>${shop.address.location}</p>
              <p>
                <ion-icon ios="location-outline" md="location" color="primary" style="font-size: 15px;"></ion-icon>
                ${distance}
              </p>
              <ion-buttons slot="end" style="display: inline-block">
              <ion-button id="btn-navigate-to-ratings-page">
              <ion-icon name="star-half-outline" color="primary"></ion-icon> ${shop.rating}
              </ion-button>
            </ion-buttons>
            </ion-label>
          </ion-item>
          <ion-button color="primary" id="btn-navigate-to-map" style="--border-radius: 25px;margin-bottom: 10px;">${trans}</ion-button>
        `;
        const infoWindow = new google.maps.InfoWindow({
          content,
          width: 200,
        });

        if (this.shopIdToOpen && this.shopIdToOpen === shop.id) {
          infoWindow.open(this.map, marker);
        }

        google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
          document
            .getElementById('btn-navigate-to-map')
            .addEventListener('click', () => {
              this.navigateToMap(shop.address.latLng);
            });
        });
        this.map.addListener('click', () => {
          console.log('clicked');
          this.activeWindow.close();
          });
        this.map.addListener('click', function(event) {
            // If the event is a POI
            if (event.placeId) {

              // Call event.stop() on the event to prevent the default info window from showing.
              event.stop();
              this.activeWindow.close();

              // do any other stuff you want to do
              // console.log('You clicked on place:' + event.placeId + ', location: ' + event.latLng);
            }
          });
        google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
          document
            .getElementById('btn-navigate-to-ratings-page')
            .addEventListener('click', () => {
              this.navigateToRatingsPage(shop.id);
            });
        });
        google.maps.event.addListener(marker, 'click', () => {
          if (this.activeWindow) {
            this.activeWindow.close();
          }
          this.activeWindow = infoWindow;
          infoWindow.open(this.map, marker);
        });
        // this.mapBounds.extend(latLng);
        if (index === shopsArray.length - 1) {
          // resolve();
        }
        this.shopMarkers.push(marker);
      });
    });
    promise.then(() => {
      // this.map.fitBounds(this.mapBounds);
    });
  }

  loadFountains() {
    this.fountainsSubscription = this.fountainService
      .getAll()
      .subscribe((fountains: Array<FountainI>) => {
        this.addFountainMarkers(fountains);
      });
  }

  navigateToRatingsPage(shopID) {
    console.log(shopID);
    this.router.navigate(['/ratings'], { queryParams: { id: shopID } });
  }

  markNearbyFountains(lat, lng) {
    this.fountainService
      .getNearByFountains(lat, lng)
      .then((fountainsData) => {
        console.log(fountainsData);

        console.log(this.fountains);
        // console.log(fountainsData.docs[0].id);
        const filteredFountains = fountainsData.docs.filter(
          (fountain) =>
          this.fountains.findIndex(f => f.id === fountain.id) < 0
        );
        console.log(filteredFountains);
        filteredFountains.map((filteredFountain) =>
          this.fountains.push(filteredFountain)
        );

        const fountains = filteredFountains.map((fountain) => {
          return fountain.data();
        });
        this.addFountainMarkers(fountains);
      });
  }
  markzoomedFountains(lat, lng,radius) {
    this.fountainService
      .getNearByzoomedFountains(lat, lng,radius)
      .then((fountainsData) => {
        console.log(fountainsData);

        console.log(this.fountains);
        // console.log(fountainsData.docs[0].id);
        const filteredFountains = fountainsData.docs.filter(
          (fountain) =>
          this.fountains.findIndex(f => f.id === fountain.id) < 0
        );
        console.log(filteredFountains);
        filteredFountains.map((filteredFountain) =>
          this.fountains.push(filteredFountain)
        );

        const fountains = filteredFountains.map((fountain) => {
          return fountain.data();
        });
        this.addFountainMarkers(fountains);
      });
  }


  // addFountainMarkers(fountains: Array<FountainI>) {
  //   const promise = new Promise((resolve, reject) => {
  //     fountains.forEach(async (fountain, index, shopsArray) => {
  //       const latLng = new google.maps.LatLng(
  //         fountain.address.latLng.lat,
  //         fountain.address.latLng.lng
  //       );
  //       const marker = new google.maps.Marker({
  //         position: latLng,
  //         map: this.map,
  //         animation: google.maps.Animation.DROP,
  //         draggable: false,
  //       });
  //       const content = `
  //       <ion-button color="primary" expand="block" id="btn-navigate-to-map" style="--border-radius: 25px;margin-bottom: 10px;">Get Directions</ion-button>
  //     `;
  //       const infoWindow = new google.maps.InfoWindow({
  //         content,
  //         width: 200,
  //       });

  //       if (this.fountainIdToOpen && this.fountainIdToOpen === fountain.id) {
  //         infoWindow.open(this.map, marker);
  //       }

  //       google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
  //         document
  //           .getElementById('btn-navigate-to-map')
  //           .addEventListener('click', () => {
  //             this.navigateToMap(fountain.address.latLng);
  //           });
  //       });
  //       google.maps.event.addListener(marker, 'click', () => {
  //         infoWindow.open(this.map, marker);
  //       });
  //       // this.mapBounds.extend(latLng);
  //       if (index === shopsArray.length - 1) {
  //         // resolve();
  //       }
  //     });
  //   });
  //   promise.then(() => {
  //     // this.map.fitBounds(this.mapBounds);
  //   });
  // }

  addFountainMarkers(fountains) {
    this.loading = true;
    console.log(fountains);
    const promise = new Promise((resolve, reject) => {
      const fountainsMarkers = [];
      fountains.forEach(async (fountain, index, shopsArray) => {

        console.log(fountain);
        const latLng = new google.maps.LatLng(
          fountain.fountainsAddress.latLng.lat,
          fountain.fountainsAddress.latLng.lng
        );
        const marker = new google.maps.Marker({
          position: latLng,
          // map: this.map,
          // animation: google.maps.Animation.DROP,
          draggable: false,
          icon: '/assets/img/icon/fountain-marker.png'
        });
        let trans;
        this.translate.get('PAGE_MAP_GET_DIRECTIONS').subscribe(res => {
          console.log(res);
          trans=res;
         });
        // this.markerClusterer = new MarkerClusterer(this.map, marker, {imagePath: '/assets/img/icon/marker-li-point.png'});
        // this.markerClusterer = new MarkerClusterer(this.map, marker, {imagePath: 'assets/img/icon/marker-blue.png'});
        const content = `
        <ion-button color="primary" expand="block" id="btn-navigate-to-map" style="--border-radius: 25px;margin-bottom: 10px;">${trans}</ion-button>
      `;
        const infoWindow = new google.maps.InfoWindow({
          content,
          width: 200,
        });
        if (this.fountainIdToOpen && this.fountainIdToOpen === fountain.id) {
          infoWindow.open(this.map, marker);
        }
        google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
          document
            .getElementById('btn-navigate-to-map')
            .addEventListener('click', () => {
              this.navigateToMap(fountain.fountainsAddress.latLng);
            });
        });
        google.maps.event.addListener(marker, 'click', () => {
          if (this.activeWindow) {
            this.activeWindow.close();
          }
          this.activeWindow = infoWindow;
          infoWindow.open(this.map, marker);
        });
        // this.mapBounds.extend(latLng);
        if (index === shopsArray.length - 1) {
          // resolve();
        }
        fountainsMarkers.push(marker);
      });
      const markerCluster = new MarkerClusterer(this.map, fountainsMarkers, {imagePath: '/assets/m'});
      const ShopsCluster = new MarkerClusterer(this.map, this.shopMarkers, {imagePath: '/assets/n'});
    });
    promise.then(() => {
      // this.map.fitBounds(this.mapBounds);
    });
    this.loading = false;
  }

  addYourLocationButton() {
    const controlDiv = document.createElement('div');

    const firstChild = document.createElement('button');
    firstChild.style.backgroundColor = '#fff';
    firstChild.style.border = 'none';
    firstChild.style.outline = 'none';
    firstChild.style.width = '28px';
    firstChild.style.height = '28px';
    firstChild.style.position = 'relative';
    // firstChild.style.bottom = '440px';
    firstChild.style.zIndex = '10';
    firstChild.style.borderRadius = '2px';
    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    firstChild.style.cursor = 'pointer';
    firstChild.style.marginRight = '10px';
    firstChild.style.padding = '0';
    firstChild.title = 'Your Location';
    controlDiv.appendChild(firstChild);

    const secondChild = document.createElement('div');
    secondChild.style.margin = '5px';
    secondChild.style.width = '18px';
    secondChild.style.height = '18px';
    secondChild.style.backgroundImage =
      'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-2x.png)';
    secondChild.style.backgroundSize = '180px 18px';
    secondChild.style.backgroundPosition = '0 0';
    secondChild.style.backgroundRepeat = 'no-repeat';
    firstChild.appendChild(secondChild);

    google.maps.event.addListener(this.map, 'center_changed', () => {
      secondChild.style['background-position'] = '0 0';
    });

    firstChild.addEventListener('click', async () => {
      let imgX = 0;
      const animationInterval = setInterval(() => {
        imgX = -imgX - 18;
        secondChild.style['background-position'] = imgX + 'px 0';
      }, 500);

      try {
        const position = await Geolocation.getCurrentPosition();
        const latlng = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        this.map.setCenter(latlng);
        this.map.setZoom(10);
        clearInterval(animationInterval);
        secondChild.style['background-position'] = '-144px 0';
      } catch (error) {
        clearInterval(animationInterval);
        secondChild.style['background-position'] = '0 0';
        this.toastService.presentToast(error.message);
      }
    });
    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
      controlDiv
    );
  }

  async navigateToMap(latLng: LatLngI) {
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

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.shopsSubscription.unsubscribe();
  }
}

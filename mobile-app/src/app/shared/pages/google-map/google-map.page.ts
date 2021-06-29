import { TranslateService } from '@ngx-translate/core';
import {
  Component,
  ViewChild,
  ElementRef,
  NgZone,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { ModalController } from '@ionic/angular';

import { AddressI } from '@app/core/models/address';
import { AlertService } from '@app/core/services/alert.service';
import { ToastService } from '@app/core/services/toast.service';

import { Plugins } from '@capacitor/core';
const {
  Geolocation
} = Plugins;

declare var google;

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.page.html',
  styleUrls: ['./google-map.page.scss'],
})
export class GoogleMapPage {
  @ViewChild('map') mapElement: ElementRef;
  map: google.maps.Map;

  @Input() lat: number;
  @Input() lng: number;

  marker: any;
  googlePlaces: any;
  geoCoder: any;

  autoCompleteService: any;
  autoCompleteOptions: google.maps.places.AutocompletionRequest;
  autoCompleteRestrictions: google.maps.places.ComponentRestrictions;
  autoCompleteItems: any;
  disableBackbtn = false;
  disableLocationSavebtn = true;
  isExit = false;

  constructor(
    private zone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private alertService: AlertService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {
    this.geoCoder = new google.maps.Geocoder();

    // Initialize Auto complete options
    this.autoCompleteService = new google.maps.places.AutocompleteService();
    this.autoCompleteRestrictions = {
      country: 'it',
    };
    this.autoCompleteOptions = {
      input: '',
      types: ['geocode'],
      componentRestrictions: this.autoCompleteRestrictions,
    };
    this.autoCompleteItems = [];
  }

  ionViewDidEnter() {
    this.initialize();
  }

  initialize() {
    this.loadMap();
  }

  createMap(latLng: google.maps.LatLng) {
    const mapOptions = {
      center: latLng,
      zoom: 15,
      streetViewControl: false,
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
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    console.log(this.mapElement);
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker(latLng);

    this.reverseGeoCode(latLng).then((addressObj) => {
      console.log(addressObj);
      this.autoCompleteOptions.input = addressObj.formatted_address;
    });
    this.addYourLocationButton();
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
        this.map.setZoom(14);
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



  loadMap() {
    if (this.lat && this.lng) {
      const latLng = new google.maps.LatLng(this.lat, this.lng);
      this.createMap(latLng);
    } else {
      Geolocation.getCurrentPosition().then(
        (coordinates) => {
          console.log('Current', coordinates);
          const latLng = new google.maps.LatLng(
            coordinates.coords.latitude,
            coordinates.coords.longitude
          );
          this.createMap(latLng);
        },
        (error) => {
          console.error(error);
          this.translate.get('PAGE_GOOGLE_MAPS_ERROR_GET_LOCATION').subscribe(res => {
            this.toastService.presentToast(res);
          });
          // this.toastService.presentToast('Unable to get your location.');
        }
      );
    }
  }

  addMarker(location: google.maps.LatLng) {
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
    });
    this.map.panTo(this.marker.getPosition());
    this.locationRefreshed(location);

    /* const self = this;
    this.marker.addListener('dragend', function() {
      console.log(this.position);
      self.locationRefreshed(this.position);
    }); */

    this.marker.addListener('dragend', (position) => {
      console.log(position);
      this.locationRefreshed(position.latLng);
    });
  }

  placeMarker(location: google.maps.LatLng) {
    this.marker.setPosition(location);
    this.map.panTo(location);
    this.locationRefreshed(location);
  }

  locationRefreshed(position: google.maps.LatLng) {
    console.log('refresh location');
    this.reverseGeoCode(position).then((addressObj) => {
      console.log(addressObj);
      this.autoCompleteOptions.input = addressObj.formatted_address;
      const country = this.extractFromAddress(
        addressObj.address_components,
        'country',
        true
      );
      if (
        country.toUpperCase() === 'it'.toUpperCase() ||
        country.toUpperCase() === 'italy'.toUpperCase()
      ) {
        console.log('country is italy');
        this.disableLocationSavebtn = false;
      } else {
        this.disableLocationSavebtn = true;
        this.translate.get('PAGE_GOOGLE_MAPS_ERROR_LOCATION').subscribe(res => {
          this.toastService.presentToast(res);
        });
      }
    });
  }

  selectSearchResult(item) {
    this.autoCompleteOptions.input = item.description;
    this.autoCompleteItems = [];
    this.geoCoder.geocode(
      { placeId: item.place_id },
      (results, status) => {
        if (status === 'OK' && results[0]) {
          this.placeMarker(results[0].geometry.location);
        } else {
          this.translate.get('PAGE_GOOGLE_MAPS_ERROR').subscribe(res => {
            this.alertService.errorAlert(res);
            // this.userAppPages[0].title = res;
          });
          // this.alertService.error('An Error Ocurred Please Try Again');
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  updateSearchResults() {
    if (this.autoCompleteOptions.input === '') {
      this.autoCompleteItems = [];
      return;
    }
    this.autoCompleteService.getPlacePredictions(
      this.autoCompleteOptions,
      (predictions) => {
        this.autoCompleteItems = [];
        if (predictions) {
          console.log('place predictions', predictions);
          this.zone.run(() => {
            predictions.forEach((prediction) => {
              this.autoCompleteItems.push(prediction);
            });
            this.changeDetectorRef.detectChanges();
          });
        }
      }
    );
  }

  reverseGeoCode(latlng: google.maps.LatLng) {
    return new Promise<any>((resolve, reject) => {
      this.geoCoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
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

  finalLocation() {
    console.log(this.marker.getPosition());
    this.reverseGeoCode(this.marker.getPosition()).then(
      (res) => {
        console.log('Reverse GC: ', res);
        const formattedAddress = this.parseAddress(res.address_components);
        console.log(JSON.stringify(formattedAddress));

        const latLng = {
          lat: res.geometry.location.lat(),
          lng: res.geometry.location.lng(),
        };
        const address: AddressI = {
          location: res.formatted_address,
          city: formattedAddress.city,
          state: formattedAddress.state,
          zip: parseFloat(formattedAddress.zip),
          latLng,
        };
        console.log(JSON.stringify(address));

        this.modalCtrl.dismiss(address);
      },
      (error) => {
        console.log(JSON.stringify(error));
        this.translate.get('PAGE_GOOGLE_MAPS_ERROR').subscribe(res => {
          this.alertService.errorAlert(res);
          // this.userAppPages[0].title = res;
        });
        // this.alertService.error('An error occured. Please try again.');
      }
    );
  }

  extractFromAddress(components, type, short = false) {
    return (
      components
        .filter((component) => component.types.indexOf(type) === 0)
        .map((item) => (short ? item.short_name : item.long_name))
        .pop() || null
    );
  }

  parseAddress(addressComponents) {
    const ShouldBeComponent = {
      zip: ['postal_code'],
      state: [
        'administrative_area_level_1',
        'administrative_area_level_2',
        'administrative_area_level_3',
        'administrative_area_level_4',
        'administrative_area_level_5',
      ],
      city: [
        'locality',
        'sublocality',
        'sublocality_level_1',
        'sublocality_level_2',
        'sublocality_level_3',
        'sublocality_level_4',
      ],
    };

    const address = {
      location: '',
      zip: '',
      state: '',
      city: '',
    };
    addressComponents.forEach((component) => {
      for (const shouldBe in ShouldBeComponent) {
        if (ShouldBeComponent[shouldBe].indexOf(component.types[0]) !== -1) {
          if (shouldBe === 'country') {
            address[shouldBe] = component.short_name;
          } else {
            address[shouldBe] = component.long_name;
          }
        }
      }
    });
    return address;
  }

  back() {
    this.modalCtrl.dismiss(null);
  }
}

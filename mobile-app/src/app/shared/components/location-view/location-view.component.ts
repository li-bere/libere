import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';

declare var google;

@Component({
  selector: 'app-location-view',
  templateUrl: './location-view.component.html',
  styleUrls: ['./location-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationViewComponent {
  @Input() lat: number;
  @Input() lng: number;

  @ViewChild('map') mapElement: ElementRef;
  map: google.maps.Map;
  loading = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async initialize() {
    console.log('initialize map');
    await this.loadMap();
  }

  async loadMap() {
    console.log('load map');
    this.map = null;
    this.loading = true;
    this.changeDetectorRef.detectChanges();
    const latLng = new google.maps.LatLng(this.lat, this.lng);

    const mapOptions = {
      center: latLng,
      zoom: 15,
      // disableDefaultUI: true,
      // gestureHandling: 'none',
      keyboardShortcuts: false,
      scaleControl: false,
      scrollwheel: false,
      navigationControl: false,
      clickableIcons: false,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    const marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      draggable: false,
    });

    this.map.setCenter(latLng);

    google.maps.event.trigger(this.map, 'resize');

    const self = this;
    this.map.addListener('tilesloaded', () => {
      console.log('map loaded');
      self.loading = false;
      google.maps.event.trigger('resize');
      self.changeDetectorRef.detectChanges();
    });
  }
}

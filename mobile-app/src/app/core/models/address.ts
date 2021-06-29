export interface LatLngI {
  lat: number;
  lng: number;
}

export interface AddressI {
  location: string;
  city: string;
  state: string;
  zip: number;
  latLng: LatLngI;
}

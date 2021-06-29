import { AddressI } from './address';

export interface TempFountainsI {
    coordinates: Array<number>;
    geoHash: string;
    geoPoint: Array<number>;
    address: AddressI;
}

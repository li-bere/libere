import { IonIntlTelInputModel } from 'ion-intl-tel-input';

import { AddressI } from './address';

export interface ShopI {
  id?: string;
  name: string;
  shopId?: string;
  sid: string;
  phone: IonIntlTelInputModel;
  address: AddressI;
  isFountain: boolean;
  shopkeeperUid: string;
  shopkeeperName: string;
  shopkeeperDisplayPhoto: string;
  credit: number;
  refills: number;
  createdAt: any;
  updatedAt: any;
  rating?: number;
  color: string;
  shopDisplayPhoto: string;
}

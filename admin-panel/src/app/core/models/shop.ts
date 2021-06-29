import { AddressI } from "./address";

export interface ShopI {
  id?: string;
  name: string;
  sid: string;
  phone: {
    internationalNumber: string;
    nationalNumber: string;
    isoCode: string;
    dialCode: string;
  };
  isApproved?: boolean;
  address: AddressI;
  isFountain: boolean;
  shopkeeperUid: string;
  shopkeeperName: string;
  credit: number;
  refills: number;
  createdAt: any;
  updatedAt: any;
}

import { IonIntlTelInputModel } from 'ion-intl-tel-input';

import { RolesI } from './roles';

export interface UserI {
    uid: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    dob: string;
    address: string;
    phone: IonIntlTelInputModel;
    vat?: string;
    fiscalCode?: string;
    displayPhoto: string | null;
    createdAt: any;
    updatedAt: any;
    deviceId: string;
    bottles?: number;
    refills?: number;
    credit?: number;
    referral?: string;
    roles: RolesI;
    invitedFrom: string;
}

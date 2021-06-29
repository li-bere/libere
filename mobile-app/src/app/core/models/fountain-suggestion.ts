import { AddressI } from './address';

export interface FountainSuggestionI {
    id?: string;
    name: string;
    suggestingUserId: string;
    suggestingUserName: string;
    suggestingUserDisplayPhoto: string;
    createdAt: any;
    updatedAt: any;
    photos: Array<string>;
    address: AddressI;
  }
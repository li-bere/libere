import { RolesI } from "./roles";

export interface UserI {
  uid: string;
  email: string;
  username: string;
  name: string;
  age: number;
  address: string;
  phone: string;
  displayPhoto: string | null;
  createdAt: any;
  updatedAt: any;
  deviceId: string;
  bottles?: number;
  refills?: number;
  credit?: number;
  roles: RolesI;
}

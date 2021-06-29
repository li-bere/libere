import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';

const { Device } = Plugins;

// import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';

@Injectable({
  providedIn: 'root'
})
export class DeviceIdService {

  constructor(
    // private uniqueDeviceID: UniqueDeviceID
  ) { }

  async getDeviceid(): Promise<string> {
    /* const info = await Device.getInfo();
    return info.uuid; */
    return 'test';
    /* return this.uniqueDeviceID.get()
    .then((uuid: string) => {
      return uuid;
    })
    .catch((error: any) => {
      throw error;
    }); */
  }
}

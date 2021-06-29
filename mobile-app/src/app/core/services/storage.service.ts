import { Injectable } from '@angular/core';

import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private afStorage: AngularFireStorage
  ) { }

  async saveFile(filePath, file, metaData = {}): Promise<AngularFireStorageReference> {
    console.log(filePath);
    console.log(file);
    console.log(metaData);
    try {
      const ref = this.afStorage.ref(filePath);
      await ref.putString(file, 'base64', metaData);
      return ref;
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }
}

import { Injectable } from '@angular/core';
// import { Plugins, CameraResultType } from '@capacitor/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';

import * as firebase from 'firebase';
import 'firebase/storage';


// const { Camera } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  
  private firebaseStorage = firebase.storage().ref();

  constructor(private camera: Camera,
              private imgPicker: ImagePicker,
              ) { }

  // async takePicture() {
  //   console.log('Uploading from cam');
  //   const image = await Camera.getPhoto({
  //     quality: 90,
  //     allowEditing: false,
  //     resultType: CameraResultType.Uri
  //   });
  //   console.log(image.path);
  //   return image.path;
  // }

  takePicture() {
    const options: CameraOptions = {
      quality: 80,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1240,
      targetHeight: 768,
      // allowEdit: true
    };
    return new Promise<any>((resolve, reject) => {
      this.camera.getPicture(options)
      .then(imageData => {
        console.log(imageData);
        resolve({ src: 'data:image/jpeg;base64,' + imageData, isSelected: false});
      })
      .catch(err => {
        console.warn("Picture Error: " + err);
        reject(err);
      });
    });
  }

  openImgPicker() {
    const options: ImagePickerOptions = {
      maximumImagesCount: 10,
      outputType: 1
    };
    return new Promise<any>((resolve, reject) => {
      this.imgPicker.getPictures(options)
      .then(results => {
        const imgUrls = [];
        if(results.length > 0) {
          results.forEach(url => {
            imgUrls.push({ src: 'data:image/jpeg;base64,' + url, isSelected: false });
          });
          resolve(imgUrls);
        }
        else {
          reject('No image selected');
        }
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  uploadImagesToFirebase(images: Array<any>, name) {
    return Promise.all(images.map(
      async (image): Promise<any> => {
          const content = await this.uploadImage(image.src, name);
          return content;
      }));
  }

  uploadImage(imageUrl, name) {
    return new Promise<any>((resolve, reject) => {
      const imageRef = this.firebaseStorage.child('fountain-suggestions').child(`${name}_${new Date().getTime()}`);
      imageRef.putString(imageUrl, 'data_url').then(snapshot => {
        snapshot.ref.getDownloadURL().then(url => {
          resolve(url);
        })
        .catch(error => {
          reject();
        });
      }, err => {
        reject(err);
      });
    });
  }

}

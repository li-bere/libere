import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageCroppedEvent } from 'ngx-image-cropper';


@Component({
  selector: 'app-image-cropping',
  templateUrl: './image-cropping.component.html',
  styleUrls: ['./image-cropping.component.scss'],
})
export class ImageCroppingComponent implements OnInit {
  @Input() base64OfProfileImage: string;
  myImage = null;
  croppedImageBase64: any;
  constructor(private modalController: ModalController) { }

  ngOnInit() {
    console.log(this.base64OfProfileImage);
    this.myImage = this.base64OfProfileImage;
  }

  imageCropped(event: ImageCroppedEvent) {
    console.log(event);
    // this.modalController.dismiss({event});
    this.croppedImageBase64 = event.base64;
  }

  dismissModal() {
    this.modalController.dismiss(this.croppedImageBase64);
  }

}

import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import { ImageService } from '@app/core/services/image.service';
import { ActionSheetController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
})
export class ImageGalleryComponent implements OnInit, OnChanges {

  @Input('imageList') imageList;
  @Input('imagesLimit') imagesLimit;
  @Input('isEditable') isEditable;
  
  @Output() onImagesUploaded = new EventEmitter<Object>();
  @Output() onImagesDeleted = new EventEmitter<Object>();

  imageSelection = false;
  selectedImages: any = [];

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private imageService: ImageService,
    private alertCtrl: AlertController,
    private translate: TranslateService
  ) { }

  ngOnInit() {}

  ngOnChanges() {
    console.log(this.imageList);
  }

  async addImages(){
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Image source',
      backdropDismiss: false,
      buttons: [{
          text: 'Take Photo',
          icon: 'camera',
          handler: () => {
            this.imageService.takePicture().then(img => {
              this.onImagesUploaded.emit({ images: img, source: 'camera'});
            });
          }
        },
        {
          text: 'Select From Gallery',
          icon: 'image',
          handler: () => {
            this.imageService.openImgPicker().then((imgs) => {
              console.log(this.imageList.length, imgs);
              this.onImagesUploaded.emit({ images: imgs, source: 'gallery' });
            });
          }
        },
        {
          text: 'Cancel',
          icon: 'cancel',
          handler: () => {
            // this.isFormSubmissionDisabled = false;
          }
        }
      ]
    });
    await actionSheet.present();
  }

  imageClicked(image, index){
    if (this.imageSelection){
      if (image.isSelected) {
        image.isSelected = !image.isSelected;
      }
      else {
        image.isSelected = true;
      }

      if (image.isSelected){
        this.selectedImages.push(image);
      }
      else {
        for (let i = 0; i< this.selectedImages.length; i++){
          if (this.selectedImages[i] == image) {
            this.selectedImages.splice(i, 1);
          }
        }
      }
    }
    else{
      // this.imageService.showImgs(this.imageList, index);
    }
  }

  selectImagesForDelete() {
    this.imageSelection = true;
  }

  resetSelectedImages(){
    this.imageSelection = false;
    this.selectedImages = [];
    this.imageList.map(function(img) {
      if (img.isSelected){
        img.isSelected = false;
      }
    });
  }

  async deleteImages() {
    const confirm = await this.alertCtrl.create({
      header: 'Confirm Deletion?',
      message: 'Are you sure you want to delete these images?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log(this.imageList);
            console.log(this.selectedImages);
            // for (let i = this.images.length - 1; i >= 0; i--){
            //   for (let j = 0; j < this.selectedImages.length; j++){
            //     if(this.images[i] && (this.images[i].src === this.selectedImages[j].src)){
            //       this.images.splice(i, 1);
            //     }
            //   }
            // }
            this.onImagesDeleted.emit(this.selectedImages);
            this.resetSelectedImages();
          }
        }
      ]
    });
    this.translate.get('COMPONENT_IMAGE_GALERY_HEADER').subscribe(res => {
      console.log(res);
      confirm.header = res;
      // this.userAppPages[0].title = res;
    });
    this.translate.get('COMPONENT_IMAGE_GALERY_MESSAGE').subscribe(res => {
      // console.log(res);
      confirm.message = res;
      // this.userAppPages[0].title = res;
    });
    this.translate.get('COMPONENT_IMAGE_GALERY_TEXT_YES').subscribe(res => {
      // console.log(res);
      confirm.buttons[0] = res;
      // this.userAppPages[0].title = res;
    });
    this.translate.get('COMPONENT_IMAGE_GALERY_NO').subscribe(res => {
      // console.log(res);
      confirm.buttons[0] = res;
      // this.userAppPages[0].title = res;
    });
    await confirm.present();
  }

}

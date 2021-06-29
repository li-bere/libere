import { FountainService } from '@app/core/services/fountain.service';
import { take } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActionSheetController, Platform, ModalController } from '@ionic/angular';

import { Plugins, CameraSource, CameraResultType } from '@capacitor/core';
const { Camera } = Plugins;
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

import { IonIntlTelInputValidators } from 'ion-intl-tel-input';

import { UserI } from '@app/core/models/user';
import { ToastService } from '@app/core/services/toast.service';
import { LoadingService } from '@app/core/services/loading.service';
import { AuthService } from '@app/core/services/auth.service';
import { UserService } from '@app/core/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import {  FilesystemDirectory } from '@capacitor/core';
import { LocationViewComponent } from '@app/shared/components/location-view/location-view.component';
import { Router } from '@angular/router';
import { QrComponent } from '@app/shared/components/qr/qr.component';
import { Observable } from 'rxjs';

import { ImageCroppingComponent } from '@app/shared/components/image-cropping/image-cropping.component';
import { rankingI } from '@app/core/models/user-ranking';
const { Filesystem } = Plugins;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChild(LocationViewComponent) private locationViewComponent: LocationViewComponent;
  @ViewChild('canvas') private canvasElement: HTMLCanvasElement;
  userProfile: UserI;

  profileCompletionPercentage = 0;

  profileFormValue = {
    firstName: '',
    lastName: '',
    username: '',
    dob: '',
    address: '',
    phone: '',
  };
  profileForm: FormGroup;
  profileFormLoading = false;

  photoLoading = false;
  loading= false;

  inviteFormValue = {
    invitee: ''
  };
  inviteForm: FormGroup;
  inviteFormLoading = false;
  qrData = '';
  qrCodeOptions = {
    elementType: 'canvas',
    scale: 8
  };
  qrDownloadBtnDisabled = true;
  name:any;

  emailVerified: boolean;
  myImage = null;
  co2: any;
  pla: any;
  constructor(
    private platform: Platform,
    private actionSheetController: ActionSheetController,
    private photoViewer: PhotoViewer,
    private modalController: ModalController,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private userService: UserService,
    private translate: TranslateService,
    private router: Router,
    private FountainService: FountainService
  ) {}

  async ngOnInit() {

    this.loading=true;
    this.getranking();
    this.profileForm = new FormGroup({
      firstName: new FormControl(this.profileFormValue.firstName, [
        Validators.pattern('[a-zA-Z ]*'),
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      lastName: new FormControl(this.profileFormValue.lastName, [
        Validators.pattern('[a-zA-Z ]*'),
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      username: new FormControl(this.profileFormValue.username, [
        Validators.required,
        Validators.pattern(
          /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/
        ),
      ]),
      dob: new FormControl(this.profileFormValue.dob),
      address: new FormControl(this.profileFormValue.address, [
        Validators.minLength(5),
        Validators.maxLength(50),
      ]),
      phone: new FormControl(this.profileFormValue.phone, [
        IonIntlTelInputValidators.phone
      ]),
    });

    this.inviteForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
      ])
    });
    const loadingText = await this.translate.get('LOADING').pipe(take(1)).toPromise();
    await this.loadingService.presentLoading(loadingText);
    this.userService.getUser().subscribe(
      async (user) => {
        console.log(user);
        this.userProfile = user;
        this.profileForm.patchValue(this.userProfile);
        // this.phone.setValue(this.userProfile.phone.internationalNumber);
        this.calculateProfilePercentage();
        await this.loadingService.dismissLoader();
      },
      async (error) => {
        console.error(error);
        await this.loadingService.dismissLoader();
      }
    );
    // this.getUser();

    this.authService.currentUserObservable.subscribe((user) => {
      if (user.emailVerified) {
        this.emailVerified = true;
      } else {
        this.emailVerified = false;
      }
    })
  }
 getranking(){
   this.userService.getranking().subscribe((res:rankingI)=>{
     this.co2=res.weeklypla2;
     this.pla=res.weeklyco2;
   })
 }
  get firstName() {
    return this.profileForm.get('firstName');
  }
  get lastName() {
    return this.profileForm.get('lastName');
  }
  get username() {
    return this.profileForm.get('username');
  }
  get dob() {
    return this.profileForm.get('dob');
  }
  get address() {
    return this.profileForm.get('address');
  }
  get phone() {
    return this.profileForm.get('phone');
  }

  get inviteEmail() {
    return this.inviteForm.get('email');
  }
  onProfileSubmit() {
    console.log(this.profileForm.value);
    if (this.username.valid) {
      this.profileFormLoading = true;
      this.userService.updateUser(this.profileForm.value, true).then(
        () => {
          this.translate.get('PAGE_PROFILE_MSG_UPDATE_PROFILE').subscribe(res => {
            this.toastService.presentToast(res);
          });
          // this.toastService.presentToast(
          //   'Profile has been updated sucessfully'
          // );
          this.profileFormLoading = false;
        },
        (error) => {
          console.error(error);
          this.profileFormLoading = false;
          this.toastService.presentToast(error.message);
        }
      );
    }
  }
  async qr(){
    this.userService.getUser().subscribe(async (user : UserI) => {
    const modal = await this.modalController.create({
      component: QrComponent,
      cssClass: 'overlay-modal',
      componentProps: {
        user: user.username
      }
    });
    return await modal.present();
  });
  }
  onInviteFormSubmit() {
    console.log(this.inviteForm.value);
    const invite = {
      invitee: this.inviteForm.value.email,
      inviterId: this.authService.currentUserId,
      inviterUserName: this.userProfile.username
    };
    this.inviteFormLoading = true;
    this.userService.inviteUser(invite)
    .then(() => {
      this.inviteForm.reset();
      this.inviteFormLoading = false;
      this.translate.get('PAGE_PROFILE_MSG_INVIRE_SENT').subscribe(res => {
        this.toastService.presentToast(res);
      });
      // this.toastService.presentToast('Invite Sent');
    }).catch(error => {
      this.inviteFormLoading = false;
      console.error(error);
      this.toastService.presentToast(error.message);
    });
  }
  // getUser() {
  //   this.userService.getUser().subscribe((user : UserI) => {
  //     // this.isFountain=this.shop.isFountain;
  //     this.name=user.username;
  //     const data = {
  //       name: this.name,
  //       type: 'user'
  //     };
  //     this.qrData = JSON.stringify(data);
  //     this.qrDownloadBtnDisabled = false;
      
  //   },
  //   (error) => {
  //     this.loading = false;
  //     console.error(error);
  //     this.toastService.presentToast(error.message);
  //   });
  // }
  // async downloadQRCode() {
  //   console.log(this.canvasElement);
  //   this.loading = true;
  //   try {
  //     const imgData = await this.canvasElement.toDataURL('image/jpeg');
  //     console.log(imgData);
  //     const data = imgData.split(',')[1];

  //     const fileName = 'libere-qr-code-' + new Date().getTime() + '.jpeg';
  //     await Filesystem.writeFile({
  //       data,
  //       path: fileName,
  //       directory: FilesystemDirectory.Documents,
  //     });

  //     console.log(FilesystemDirectory.Documents);
  //     console.log(FilesystemDirectory.ExternalStorage);

  //     this.loading = false;
  //     this.toastService.presentToast(
  //       'Your qr code has been saved in the gallery.'
  //     );
  //   } catch (error) {
  //     console.error(error);
  //     this.loading = false;
  //     this.translate.get('PAGE_VIEW_ERROR_MSG_ERROR_QR_CODE').subscribe(res => {
  //       this.toastService.presentToast(res);
  //     });
  //     // this.toastService.presentToast('Could not save the qr code');
  //   }
  // }

  calculateProfilePercentage() {
    this.profileCompletionPercentage = 0;
    if (this.userProfile.firstName && this.userProfile.firstName !== '') {
      this.profileCompletionPercentage += 0.1;
    }
    if (this.userProfile.lastName && this.userProfile.lastName !== '') {
      this.profileCompletionPercentage += 0.1;
    }
    if (this.userProfile.dob && this.userProfile.dob !== '') {
      this.profileCompletionPercentage += 0.2;
    }
    if (this.userProfile.address && this.userProfile.address !== '') {
      this.profileCompletionPercentage += 0.3;
    }
    if (this.userProfile.phone) {
      this.profileCompletionPercentage += 0.3;
    }
  }

  getTruePercentage() {
    return Math.floor(this.profileCompletionPercentage * 100);
  }

  async takePhoto(): Promise<void> {
    this.photoLoading = true;
    try {
      const photo = await this.getPhoto(CameraSource.Camera);
      if (photo) {
        console.log(photo);
        this.myImage = photo;
        this.openImageCropper(photo).then((croppedImageBase64) => {
          console.log(croppedImageBase64);
        });
        // try {
        //   await this.userService.saveUserDisplayPhoto(photo);
        //   this.photoLoading = false;
        // } catch (error) {
        //   this.photoLoading = false;
        //   console.error(JSON.stringify(error));
        // }
      }
    } catch (error) {
      this.photoLoading = false;
    }
  }

  async selectPhoto(): Promise<void> {
    this.photoLoading = true;
    try {
      const photo = await this.getPhoto(CameraSource.Photos);
      if (photo) {
        console.log(photo);
        this.myImage = photo;
        this.openImageCropper(photo).then((croppedImageBase64) => {
          console.log(croppedImageBase64);
        });
        // try {
        //   await this.userService.saveUserDisplayPhoto(photo);
        //   this.photoLoading = false;
        // } catch (error) {
        //   this.photoLoading = false;
        //   console.error(error);
        // }
      }
    } catch (error) {
      this.photoLoading = false;
    }
  }

  async openImageCropper(photoBase64) {
    const modal = await this.modalController.create({
      component: ImageCroppingComponent,
      cssClass: 'overlay-modal',
      // backdropDismiss: true,
      componentProps: {
        base64OfProfileImage: photoBase64
      },
    });
    modal.onDidDismiss().then(async (data) => {
      console.log(data.data);
      let base64StringFromCropper = data.data;
      console.log(base64StringFromCropper.split(','));
      let base64StringSet = base64StringFromCropper.split(',');
        try {
          await this.userService.saveUserDisplayPhoto(base64StringSet[1]);
          this.photoLoading = false;
        } catch (error) {
          this.photoLoading = false;
          console.error(error);
        }
    });
    return await modal.present();
  }



  // imageCropped(event: ImageCroppedEvent) {
  //   let croppedImage = event.base64;
  //   console.log(croppedImage);
  // }

 

  private async getPhoto(source: CameraSource): Promise<string | undefined> {
    const image = await Plugins.Camera.getPhoto({
      quality: 10,
      // allowEditing: true,
      resultType: CameraResultType.DataUrl,
      // saveToGallery: true,
      source,
    });

    // this.myImage = image.base64String;

    return image.dataUrl;
  }



  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            console.log('Camera clicked');
            this.takePhoto();
          },
        },
        {
          text: 'Gallery',
          icon: 'image',
          handler: () => {
            console.log('Gallery clicked');
            this.selectPhoto();
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();
  }

  viewImage(imagePath) {
    if (this.platform.is('cordova')) {
      this.photoViewer.show(imagePath);
    } else {
      const image = new Image();
      image.src = imagePath;
      const w = window.open(image.src, '_blank');
    }
  }
}

import { TranslateService } from '@ngx-translate/core';
import { ActionSheetController, ModalController, Platform } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IonIntlTelInputValidators } from 'ion-intl-tel-input';

import { Plugins, CameraSource, CameraResultType } from '@capacitor/core';
const { Camera } = Plugins;
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

import { UserI } from '@app/core/models/user';
import { ToastService } from '@app/core/services/toast.service';
import { LoadingService } from '@app/core/services/loading.service';
import { AuthService } from '@app/core/services/auth.service';
import { UserService } from '@app/core/services/user.service';
import { italianFiscalCodeValidator } from '@app/shared/validators/italian-fiscal-code.validator';
import { italianVatNumberValidator } from '@app/shared/validators/italian-vat-number.validator';
import { take } from 'rxjs/operators';
import {  FilesystemDirectory } from '@capacitor/core';
const { Filesystem } = Plugins;

import { LocationViewComponent } from '@app/shared/components/location-view/location-view.component';
import { QrComponent } from '@app/shared/components/qr/qr.component';
import { ImageCroppingComponent } from '@app/shared/components/image-cropping/image-cropping.component';
import { rankingI } from '@app/core/models/user-ranking';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit {

  @ViewChild(LocationViewComponent) private locationViewComponent: LocationViewComponent;
  @ViewChild('canvas') private canvasElement: HTMLCanvasElement;
  userProfile: UserI;
  loading = false;
  d = new Date();
  maxDOB =
    this.d.getDate() +
    '-' +
    (this.d.getMonth() + 1) +
    '-' +
    this.d.getFullYear();
  minDOB = '01-01-1800';

  profileFormValue = {
    firstName: '',
    lastName: '',
    username: '',
    dob: '',
    address: '',
    phone: '',
    vat: '',
    fiscalCode: '',
  };
  co2;
  pla;
  profileForm: FormGroup;
  profileFormLoading = false;

  inviteFormValue = {
    invitee: '',
  };
  inviteForm: FormGroup;
  inviteFormLoading = false;

  photoLoading = false;

  profileCompletionPercentage = 0;
  
  qrData = '';
  qrCodeOptions = {
    elementType: 'canvas',
    scale: 8
  };
  qrDownloadBtnDisabled = true;
  name: any;
  constructor(
    private platform: Platform,
    private actionSheetController: ActionSheetController,
    private photoViewer: PhotoViewer,
    private modalController: ModalController,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private userService: UserService,
    private translate: TranslateService
  ) {}

  async ngOnInit() {
    this.loading = true;
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
        IonIntlTelInputValidators.phone,
      ]),
      vat: new FormControl(this.profileFormValue.vat, [
        italianVatNumberValidator,
      ]),
      fiscalCode: new FormControl(this.profileFormValue.fiscalCode, [
        italianFiscalCodeValidator,
      ]),
    });

    this.inviteForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
      ]),
    });
    const loadingText = await this.translate.get('LOADING').pipe(take(1)).toPromise();
      await this.loadingService.presentLoading(loadingText);
   
    this.userService.getUser().subscribe(
      async (user) => {
        console.log(user);
        this.userProfile = user;
        this.profileForm.patchValue(this.userProfile);
        this.calculateProfilePercentage();
        await this.loadingService.dismissLoader();
      },
      async (error) => {
        console.error(error);
        await this.loadingService.dismissLoader();
      }
    );
    this.getranking();
    // this.getUser();
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
  get vat() {
    return this.profileForm.get('vat');
  }
  get fiscalCode() {
    return this.profileForm.get('fiscalCode');
  }

  get inviteEmail() {
    return this.inviteForm.get('email');
  }

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

  onInviteFormSubmit() {
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
  async takePhoto(): Promise<void> {
    this.photoLoading = true;
    const photo = await this.getPhoto(CameraSource.Camera);
    if (photo) {
      console.log(photo);
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
    this.photoLoading = false;
  }

  async selectPhoto(): Promise<void> {
    this.photoLoading = true;
    const photo = await this.getPhoto(CameraSource.Photos);
    if (photo) {
      console.log(photo);
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
    this.photoLoading = false;
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
          this.photoLoading = true;
          await this.userService.saveUserDisplayPhoto(base64StringSet[1]);
          this.photoLoading = false;
        } catch (error) {
          this.photoLoading = false;
          console.error(error);
        }
    });
    return await modal.present();
  }

  private async getPhoto(source: CameraSource): Promise<string | undefined> {
    const image = await Camera.getPhoto({
      quality: 10,
      // allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source,
    });

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

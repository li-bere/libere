import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ImageService } from '@app/core/services/image.service';
import { LoadingService } from '@app/core/services/loading.service';
import { AuthService } from '@app/core/services/auth.service';
import { CurrentTimeService } from '@app/core/services/current-time.service';
import { FountainSuggestionI } from '@app/core/models/fountain-suggestion';
import { FountainService } from '@app/core/services/fountain.service';
import { ToastService } from '@app/core/services/toast.service';
import { UserService } from '@app/core/services/user.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-request-fountain-registry',
  templateUrl: './request-fountain-registry.page.html',
  styleUrls: ['./request-fountain-registry.page.scss'],
})
export class RequestFountainRegistryPage implements OnInit {

  latLng = { lat: 0, lng: 0 };
  address = { location: '', city: '', state: '', zip: '', latLng: this.latLng };
  formValue = { name: '', address: this.address };
  fountainRegistryForm: FormGroup;
  fountainPhotos: Array<any> = [];

  constructor(
    private imageService: ImageService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private currentTimeService: CurrentTimeService,
    private fountainService: FountainService,
    private toastService: ToastService,
    private userService: UserService,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.fountainRegistryForm = new FormGroup({
      name: new FormControl(this.formValue.name, [
        Validators.required,
        Validators.pattern('[a-zA-Z0-9 ]*'),
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      address: new FormGroup({
        location: new FormControl(this.formValue.address.location, [
          Validators.compose([Validators.required]),
        ]),
        city: new FormControl(this.formValue.address.city, [
          Validators.compose([Validators.required]),
        ]),
        state: new FormControl(this.formValue.address.state, [
          Validators.compose([Validators.required]),
        ]),
        zip: new FormControl(this.formValue.address.zip, [
          Validators.compose([Validators.required]),
        ]),
        latLng: new FormGroup({
          lat: new FormControl(this.formValue.address.latLng.lat, [
            Validators.compose([Validators.required]),
          ]),
          lng: new FormControl(this.formValue.address.latLng.lng, [
            Validators.compose([Validators.required]),
          ]),
        }),
      }),
    });
  }

  get fountainAddress() { return this.fountainRegistryForm.get('address'); }
  get name() { return this.fountainRegistryForm.get('name'); }

  addFountainImages(event) {
    console.log(event.images);
    if (event.source === 'camera') {
      this.fountainPhotos.push(event.images);
      this.fountainPhotos = this.fountainPhotos.slice();
    }
    else {
      this.fountainPhotos.length > 0 ? this.fountainPhotos = this.fountainPhotos.concat(event.images) : this.fountainPhotos = event.images;
      this.fountainPhotos = this.fountainPhotos.slice();
    }
  }

  removeFountainImages(imgSelectedForRemoval) {
    console.log(imgSelectedForRemoval);
    for (let i = this.fountainPhotos.length - 1; i >= 0; i--){
      for (let j = 0; j < imgSelectedForRemoval.length; j++){
        if(this.fountainPhotos[i] && (this.fountainPhotos[i].src === imgSelectedForRemoval[j].src)){
          this.fountainPhotos.splice(i, 1);
        }
      }
    }
    this.fountainPhotos = this.fountainPhotos.slice();
  }

  async uploadFountainImages() {
    console.log(this.fountainPhotos);
    await this.loadingService.presentLoading('');
    return new Promise<any>((resolve, reject) => {
      this.imageService.uploadImagesToFirebase(this.fountainPhotos, this.name.value).then(res => {
        resolve(res);
      }).catch(async error => {
       await this.loadingService.dismissLoader();
        console.log(error);
        reject();
      });
    });
  }

  onSubmit() {
    this.uploadFountainImages()
    .then(async uploadedPhotosArray => {
      const user = await this.userService.getUser().pipe(take(1)).toPromise();
      const fountainSuggestion: FountainSuggestionI = {
        name: this.name.value,
        suggestingUserId: this.authService.currentUserId,
        suggestingUserName: user.firstName + ' ' + user.lastName,
        suggestingUserDisplayPhoto: user.displayPhoto,
        photos: uploadedPhotosArray,
        address: this.fountainAddress.value,
        createdAt: this.currentTimeService.getCurrentTime(),
        updatedAt: this.currentTimeService.getCurrentTime()
      };
      this.fountainService.addFountainSuggestion(fountainSuggestion).then(async res => {
        console.log(res);
        await this.loadingService.dismissLoader();
        this.translate.get('PAGE_REQUEST_FOUNTAIN_REGISTRY_MSG_SUGGESTION_FORWARD').subscribe(res => {
          this.toastService.presentToast(res);
        });
        // this.toastService.presentToast('Your suggestion has been forwarded.');
        this.router.navigate(['/user-tabs/home']);
      })
      .catch(async err => {
        await this.loadingService.dismissLoader();
        this.translate.get('PAGE_REQUEST_FOUNTAIN_REGISTRY_ERROR_MSG_SUGGESTION_FORWARD').subscribe(res => {
          this.toastService.presentToast(res);
        });
        // this.toastService.presentToast('An error occurred while forwarding your suggestion.');
      });
    }).
    catch(async error => {
      await this.loadingService.dismissLoader();
      console.log(error);
      this.translate.get('PAGE_REQUEST_FOUNTAIN_REGISTRY_ERROR_IMAGES_UPLOAD').subscribe(res => {
        this.toastService.presentToast(res);
      });
      // this.toastService.presentToast('An error occurred while uploading images.');
    });
  }

}

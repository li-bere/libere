import { AntiFloodComponent } from './components/anti-flood/anti-flood.component';

import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpinnerComponent } from './components/spinner/spinner.component';
import { LocationComponent } from './components/location/location.component';
import { LocationViewComponent } from './components/location-view/location-view.component';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';

import { GoogleMapPage } from '@app/shared/pages/google-map/google-map.page';
import { TransactionDetailsPage } from '@app/shared/pages/transaction-details/transaction-details.page';
import { RatingComponent } from './components/rating/rating.component';
import { IonicRatingModule } from 'ionic4-rating';
import { LanguageToggleComponent } from './components/language-toggle/language-toggle.component';
import { TranslateModule } from '@ngx-translate/core';
import { QrComponent } from './components/qr/qr.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { AddCommentComponent } from './components/add-comment/add-comment.component';
import { ImageCroppingComponent } from './components/image-cropping/image-cropping.component';
import { ImageCropperModule } from 'ngx-image-cropper';


// import { IonicRatingComponent } from 'ionic-rating-component';

@NgModule({
  declarations: [
    SpinnerComponent,
    LocationComponent,
    LocationViewComponent,
    ImageGalleryComponent,
    GoogleMapPage,
    TransactionDetailsPage,
    RatingComponent,
    LanguageToggleComponent,
    AntiFloodComponent,
    QrComponent,
    AddCommentComponent,
    ImageCroppingComponent
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    IonicRatingModule,
    // onicRatingComponent,I
    TranslateModule,
    NgxQRCodeModule,
    ImageCropperModule
  ],
  exports: [
    SpinnerComponent,
    LocationComponent,
    LocationViewComponent,
    ImageGalleryComponent,
    GoogleMapPage,
    LanguageToggleComponent,
    AntiFloodComponent,
    QrComponent,
    AddCommentComponent,
    ImageCroppingComponent
  ]
})
export class SharedModule { }

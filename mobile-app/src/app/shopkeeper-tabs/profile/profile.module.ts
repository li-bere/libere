import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IonIntlTelInputModule } from 'ion-intl-tel-input';

import { SharedModule } from '@app/shared/shared.module';

import { ProfilePageRoutingModule } from './profile-routing.module';
import { ProfilePage } from './profile.page';
import { TranslateModule } from '@ngx-translate/core';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
// import { QrComponent } from '@app/shared/components/qr/qr.component';

@NgModule({
  imports: [
    CommonModule,
    NgxQRCodeModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    IonicModule,
    IonIntlTelInputModule,
    SharedModule,
    ProfilePageRoutingModule,
  ],
  declarations: [ProfilePage,
    // QrComponent
  ],
})
export class ProfilePageModule {}


import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifyEmailPageRoutingModule } from './verify-email-routing.module';

import { VerifyEmailPage } from './verify-email.page';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    IonicModule,
    VerifyEmailPageRoutingModule,
    SharedModule
  ],
  declarations: [VerifyEmailPage]
})
export class VerifyEmailPageModule {}

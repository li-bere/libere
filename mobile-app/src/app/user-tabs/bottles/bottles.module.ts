import { SharedModule } from '@app/shared/shared.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BottlesPageRoutingModule } from './bottles-routing.module';
import { BottlesPage } from './bottles.page';
import { TranslateModule } from '@ngx-translate/core';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    NgxQRCodeModule,
    SharedModule,
    BottlesPageRoutingModule
  ],
  declarations: [BottlesPage]
})
export class BottlesPageModule {}

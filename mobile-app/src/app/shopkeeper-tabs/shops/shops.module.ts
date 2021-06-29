import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
// import { QrComponent } from '../../shared/components/qr/qr.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '@app/shared/shared.module';

import { ShopsPageRoutingModule } from './shops-routing.module';
import { ShopsPage } from './shops.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    NgxQRCodeModule,
    SharedModule,
    ShopsPageRoutingModule
  ],
  declarations: [ShopsPage, 
    // QrComponent
  ]
})
export class ShopsPageModule {}

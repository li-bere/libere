import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '@app/shared/shared.module';

import { ScanPageRoutingModule } from './scan-routing.module';
import { ScanPage } from './scan.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    SharedModule,
    ScanPageRoutingModule
  ],
  declarations: [ScanPage]
})
export class ScanPageModule {}

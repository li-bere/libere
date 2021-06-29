import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NonVerifiedPageRoutingModule } from './non-verified-routing.module';

import { NonVerifiedPage } from './non-verified.page';
// import { AntiFloodComponent } from '@app/shared/components/anti-flood/anti-flood.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    IonicModule,
    SharedModule,
    NonVerifiedPageRoutingModule
  ],
  declarations: [NonVerifiedPage]
})
export class NonVerifiedPageModule {}

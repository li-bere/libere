import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestFountainRegistryPageRoutingModule } from './request-fountain-registry-routing.module';

import { RequestFountainRegistryPage } from './request-fountain-registry.page';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    IonicModule,
    RequestFountainRegistryPageRoutingModule
  ],
  declarations: [RequestFountainRegistryPage]
})
export class RequestFountainRegistryPageModule {}

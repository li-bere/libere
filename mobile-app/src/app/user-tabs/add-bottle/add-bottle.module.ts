import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '@app/shared/shared.module';

import { AddBottlePageRoutingModule } from './add-bottle-routing.module';
import { AddBottlePage } from './add-bottle.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    AddBottlePageRoutingModule
  ],
  declarations: [AddBottlePage]
})
export class AddBottlePageModule {}

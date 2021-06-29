import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopkeeperTabsPageRoutingModule } from './shopkeeper-tabs-routing.module';

import { ShopkeeperTabsPage } from './shopkeeper-tabs.page';
import { JoyrideModule } from 'ngx-joyride';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    IonicModule,
    ShopkeeperTabsPageRoutingModule,
    JoyrideModule.forChild()
  ],
  declarations: [ShopkeeperTabsPage]
})
export class ShopkeeperTabsPageModule {}

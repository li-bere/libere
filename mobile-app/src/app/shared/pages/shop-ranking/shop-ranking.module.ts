import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopRankingPageRoutingModule } from './shop-ranking-routing.module';

import { ShopRankingPage } from './shop-ranking.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopRankingPageRoutingModule
  ],
  declarations: [ShopRankingPage]
})
export class ShopRankingPageModule {}

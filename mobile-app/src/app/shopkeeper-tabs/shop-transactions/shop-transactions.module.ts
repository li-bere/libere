import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopTransactionsPageRoutingModule } from './shop-transactions-routing.module';

import { ShopTransactionsPage } from './shop-transactions.page';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ShopTransactionsPageRoutingModule
  ],
  declarations: [ShopTransactionsPage]
})
export class ShopTransactionsPageModule {}

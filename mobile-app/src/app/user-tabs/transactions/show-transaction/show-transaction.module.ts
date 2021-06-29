import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowTransactionPageRoutingModule } from './show-transaction-routing.module';

import { ShowTransactionPage } from './show-transaction.page';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    IonicModule,
    ShowTransactionPageRoutingModule
  ],
  declarations: [ShowTransactionPage]
})
export class ShowTransactionPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewTransactionsPageRoutingModule } from './view-transactions-routing.module';

import { ViewTransactionsPage } from './view-transactions.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    ViewTransactionsPageRoutingModule
  ],
  declarations: [ViewTransactionsPage]
})
export class ViewTransactionsPageModule {}

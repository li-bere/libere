import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmTransactionPageRoutingModule } from './confirm-transaction-routing.module';

import { ConfirmTransactionPage } from './confirm-transaction.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmTransactionPageRoutingModule,
    TranslateModule,
    SharedModule
  ],
  declarations: [ConfirmTransactionPage]
})
export class ConfirmTransactionPageModule {}

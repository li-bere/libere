import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '@app/shared/shared.module';

import { ConfirmPage } from './confirm/confirm.page';

import { TransactionsPageRoutingModule } from './transactions-routing.module';
import { TransactionsPage } from './transactions.page';
import { TranslateModule } from '@ngx-translate/core';
import { AntiFloodComponent } from '@app/shared/components/anti-flood/anti-flood.component';

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    TransactionsPageRoutingModule,
 
  ],
  declarations: [TransactionsPage, ConfirmPage]
})
export class TransactionsPageModule {}

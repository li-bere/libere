import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { JoyrideModule } from 'ngx-joyride';
import { UserTabsPageRoutingModule } from './user-tabs-routing.module';
import { UserTabsPage } from './user-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    IonicModule,
    UserTabsPageRoutingModule,
    JoyrideModule.forChild()
  ],
  declarations: [UserTabsPage]
})
export class UserTabsPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceIdService } from './services/device-id.service';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    DeviceIdService,
    AuthService
  ],
})
export class CoreModule { }

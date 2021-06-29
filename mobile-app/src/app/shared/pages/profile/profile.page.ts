import { ShopService } from '@app/core/services/shop.service';
import { ShopI } from './../../../core/models/shop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserI } from '@app/core/models/user';
import { UserService } from '@app/core/services/user.service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Platform, ModalController } from '@ionic/angular';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  shopProfile: ShopI;
  user: UserI;
  constructor(
              private activatedRoute: ActivatedRoute,
              private userService: UserService,
              ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.fetchUserProfile(params.id);
    });
  }

  fetchUserProfile(userId) {
    this.userService.getProfile(userId).subscribe(result => {
      this.user = result;
      console.log(this.user);
    });
  }

}

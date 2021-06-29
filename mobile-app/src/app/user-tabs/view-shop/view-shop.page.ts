import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from '@app/core/services/shop.service';
import { ShopI } from '../../core/models/shop';

@Component({
  selector: 'app-view-shop',
  templateUrl: './view-shop.page.html',
  styleUrls: ['./view-shop.page.scss'],
})
export class ViewShopPage implements OnInit {
  shopView: ShopI
  constructor(
              private activatedRoute: ActivatedRoute,
              private shopService: ShopService,
              private router: Router
              ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.fetchShopData(params);
    });
  }

  fetchShopData(shopId) {
    this.shopService.getProfile(shopId.id).subscribe(res => {
      this.shopView = res;
      console.log(this.shopView);
    });
  }

  gotoShopkeeperProfile(shopkeeperId) {
    this.router.navigate(['./profile'], { queryParams: { id: shopkeeperId } });
  }

}

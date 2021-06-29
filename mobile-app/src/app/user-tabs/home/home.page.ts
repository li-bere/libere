import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserI } from '@app/core/models/user';
import { TransactionI } from '@app/core/models/transaction';
import { ToastService } from '@app/core/services/toast.service';
import { UserService } from '@app/core/services/user.service';
import { TransactionService } from '@app/core/services/transaction.service';
import { DirectionsService } from '@app/core/services/directions.service';
import { ThemeService } from '@app/core/services/theme.service';
import { AuthService } from '@app/core/services/auth.service';
import { rankingI } from '@app/core/models/user-ranking';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user: UserI;
  userLoading = false;
  pla: any;
  co2: any;

  refills: Array<TransactionI>;
  refillsLoading = false;
  darkValue: boolean;
  constructor(
    private router: Router,
    private toastService: ToastService,
    private userService: UserService,
    private transactionService: TransactionService,
    private directionService: DirectionsService,
    private themeService: ThemeService,
    private authservice: AuthService
  ) {}



  get darkBoolean() {
    return this.themeService.sharedDarkValue;
  }

  ngOnInit() {
    // this.authservice.currentUserObservable.subscribe(user=>{
    //   user.reload();
    //   user.reload();
    // })
    this.darkValue = this.darkBoolean;
    console.log(this.darkValue);
    this.getUser();
    this.getRefills();
    this.getranking();

  }
  getranking(){
    this.userService.getranking().subscribe((res:rankingI)=>{
      this.pla=res.weeklypla2;
      this.co2=res.weeklyco2;
    })
  }
  onChange(ev) {
    console.log(ev);
    this.themeService.setAppTheme(ev.detail.checked);
  }

  getUser() {
    this.userLoading = true;
    this.userService.getUser().subscribe(
      (user: UserI) => {
        this.user = user;
        this.userLoading = false;
      },
      (error) => {
        this.userLoading = false;
        console.error(error);
        this.toastService.presentToast(error.message);
      }
    );
  }

  getRefills() {
    this.refillsLoading = true;
    this.transactionService.getTransactions('debit', 'refill', 3).subscribe(
      (refills: Array<TransactionI>) => {
        this.refills = refills;
        this.refillsLoading = false;
      },
      (error) => {
        this.refillsLoading = false;
        console.error(error);
        this.toastService.presentToast(error.message);
      }
    );
  }

  getDirections(shopId) {
    this.directionService.getDirections(shopId);
  }

  gotoShopkeeperProfile(shopId) {
    console.log(shopId);
    this.router.navigate(['./view-shop'], { queryParams: { id: shopId } });
  }
}
